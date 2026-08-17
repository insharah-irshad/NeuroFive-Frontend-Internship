/* ==========================================================================
   AETHER — weather observatory
   No frameworks, no build step. Talks to Open-Meteo (no API key required).
   ========================================================================== */

(() => {
  "use strict";

  const GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search";
  const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

  const $ = (id) => document.getElementById(id);

  const els = {
    body: document.body,
    form: $("searchForm"),
    input: $("cityInput"),
    searchBtn: $("searchBtn"),
    liveDot: $("liveDot"),
    clock: $("localClock"),
    status: $("statusLine"),
    reading: $("reading"),
    place: $("placeName"),
    temp: $("tempValue"),
    condition: $("conditionText"),
    feels: $("feelsLike"),
    humidity: $("statHumidity"),
    wind: $("statWind"),
    pressure: $("statPressure"),
    uv: $("statUv"),
    horizon: $("horizon"),
    horizonPath: $("horizonPath"),
    horizonMarker: $("horizonMarker"),
    sunrise: $("sunriseTime"),
    sunset: $("sunsetTime"),
    dayProgress: $("dayProgress"),
    prevention: $("preventionList"),
    lifestyle: $("lifestyleList"),
    forecastRow: $("forecastRow"),
    coords: $("coordsLine"),
    canvas: $("skyCanvas"),
  };

  /* ------------------------------------------------------------------------
     WMO weather-code → category, label, sky state
     ------------------------------------------------------------------------ */

  const CODE_TABLE = {
    0:  { cat: "clear",   label: "Clear sky" },
    1:  { cat: "partly",  label: "Mainly clear" },
    2:  { cat: "partly",  label: "Partly cloudy" },
    3:  { cat: "overcast",label: "Overcast" },
    45: { cat: "fog",     label: "Fog" },
    48: { cat: "fog",     label: "Depositing rime fog" },
    51: { cat: "rain",    label: "Light drizzle" },
    53: { cat: "rain",    label: "Drizzle" },
    55: { cat: "rain",    label: "Dense drizzle" },
    56: { cat: "rain",    label: "Freezing drizzle" },
    57: { cat: "rain",    label: "Dense freezing drizzle" },
    61: { cat: "rain",    label: "Light rain" },
    63: { cat: "rain",    label: "Rain" },
    65: { cat: "rain",    label: "Heavy rain" },
    66: { cat: "rain",    label: "Freezing rain" },
    67: { cat: "rain",    label: "Heavy freezing rain" },
    71: { cat: "snow",    label: "Light snow" },
    73: { cat: "snow",    label: "Snow" },
    75: { cat: "snow",    label: "Heavy snow" },
    77: { cat: "snow",    label: "Snow grains" },
    80: { cat: "rain",    label: "Light showers" },
    81: { cat: "rain",    label: "Showers" },
    82: { cat: "rain",    label: "Violent showers" },
    85: { cat: "snow",    label: "Snow showers" },
    86: { cat: "snow",    label: "Heavy snow showers" },
    95: { cat: "storm",   label: "Thunderstorm" },
    96: { cat: "storm",   label: "Thunderstorm with hail" },
    99: { cat: "storm",   label: "Severe thunderstorm" },
  };

  function codeInfo(code) {
    return CODE_TABLE[code] || { cat: "overcast", label: "Unsettled" };
  }

  /* ------------------------------------------------------------------------
     State
     ------------------------------------------------------------------------ */

  const state = {
    particleMode: "clear-day",
    isDay: true,
    raf: null,
    canvasCtx: null,
    particles: [],
    clockTimer: null,
    tzOffsetMinutes: null, // location's UTC offset, so the clock reads true local time
  };

  /* ------------------------------------------------------------------------
     Init
     ------------------------------------------------------------------------ */

  function init() {
    setupCanvas();
    startAmbientClock();
    els.form.addEventListener("submit", onSubmit);
    // seed a gentle default sky before any search
    applySky("clear-day", true);
    els.status.textContent = "";
  }

  function onSubmit(e) {
    e.preventDefault();
    const query = els.input.value.trim();
    if (!query) {
      setStatus("Type a city name first.", true);
      return;
    }
    runSearch(query);
  }

  /* ------------------------------------------------------------------------
     Search pipeline
     ------------------------------------------------------------------------ */

  async function runSearch(query) {
    setLoading(true);
    setStatus(`Locating ${query}…`, false);
    els.liveDot.classList.remove("is-live");

    try {
      const place = await geocode(query);
      setStatus(`Reading the sky over ${place.name}…`, false);

      const weather = await fetchForecast(place.latitude, place.longitude);
      render(place, weather);

      els.body.dataset.hasData = "true";
      setStatus("", false);
      els.liveDot.classList.add("is-live");
    } catch (err) {
      console.error(err);
      setStatus(err.message || "Something broke reading that sky. Try again.", true);
    } finally {
      setLoading(false);
    }
  }

  async function geocode(query) {
    const url = `${GEOCODE_URL}?name=${encodeURIComponent(query)}&count=1&language=en&format=json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("The location service didn't respond. Try again in a moment.");
    const data = await res.json();
    if (!data.results || data.results.length === 0) {
      throw new Error(`No city found matching "${query}". Check the spelling and try again.`);
    }
    const r = data.results[0];
    return {
      name: r.name,
      country: r.country || "",
      admin1: r.admin1 || "",
      latitude: r.latitude,
      longitude: r.longitude,
    };
  }

  async function fetchForecast(lat, lon) {
    const params = new URLSearchParams({
      latitude: lat,
      longitude: lon,
      current: [
        "temperature_2m", "relative_humidity_2m", "apparent_temperature",
        "is_day", "weather_code", "wind_speed_10m", "surface_pressure",
        "precipitation",
      ].join(","),
      daily: [
        "weather_code", "temperature_2m_max", "temperature_2m_min",
        "sunrise", "sunset", "uv_index_max", "precipitation_probability_max",
        "wind_speed_10m_max",
      ].join(","),
      timezone: "auto",
      forecast_days: "4",
    });

    const res = await fetch(`${FORECAST_URL}?${params.toString()}`);
    if (!res.ok) throw new Error("The forecast service didn't respond. Try again in a moment.");
    const data = await res.json();
    if (!data.current || !data.daily) throw new Error("Incomplete data came back for that location.");
    return data;
  }

  /* ------------------------------------------------------------------------
     Render
     ------------------------------------------------------------------------ */

  function render(place, data) {
    const c = data.current;
    const d = data.daily;
    const info = codeInfo(c.weather_code);
    const isDay = c.is_day === 1;
    state.isDay = isDay;
    state.tzOffsetMinutes = data.utc_offset_seconds ? data.utc_offset_seconds / 60 : 0;

    // location line
    const region = [place.admin1, place.country].filter(Boolean).join(", ");
    els.place.textContent = region ? `${place.name} — ${region}` : place.name;
    els.coords.textContent = `${place.latitude.toFixed(2)}°, ${place.longitude.toFixed(2)}°  ·  UTC${formatOffset(data.utc_offset_seconds)}`;

    // temperature — count up from current displayed value
    animateNumber(els.temp, Math.round(c.temperature_2m), "°");
    els.condition.textContent = info.label;
    els.feels.textContent = `Feels like ${Math.round(c.apparent_temperature)}°`;

    els.humidity.textContent = `${Math.round(c.relative_humidity_2m)}%`;
    els.wind.textContent = `${Math.round(c.wind_speed_10m)} km/h`;
    els.pressure.textContent = `${Math.round(c.surface_pressure)} hPa`;
    els.uv.textContent = d.uv_index_max?.[0] != null ? d.uv_index_max[0].toFixed(1) : "—";

    // sky + particles
    const skyState = `${info.cat}-${isDay ? "day" : "night"}`;
    applySky(skyState, false);

    // horizon arc
    updateHorizon(d.sunrise[0], d.sunset[0], d.sunrise[1], c.time);

    // notes
    renderNotes(info.cat, c, d);

    // forecast
    renderForecast(d);

    // reveal sequence
    reveal();
  }

  function formatOffset(seconds) {
    if (seconds == null) return "";
    const sign = seconds >= 0 ? "+" : "-";
    const abs = Math.abs(seconds);
    const h = Math.floor(abs / 3600);
    const m = Math.round((abs % 3600) / 60);
    return `${sign}${h}${m ? ":" + String(m).padStart(2, "0") : ""}`;
  }

  function reveal() {
    els.reading.classList.add("is-visible");
    els.horizon.classList.add("is-visible");
    document.querySelectorAll(".panel").forEach((panel, i) => {
      setTimeout(() => panel.classList.add("is-visible"), i * 110);
    });
  }

  function animateNumber(node, target, suffix) {
    const start = parseInt(node.textContent, 10) || 0;
    const duration = 700;
    const t0 = performance.now();
    function tick(now) {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = Math.round(start + (target - start) * eased);
      node.textContent = `${val}${suffix}`;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ------------------------------------------------------------------------
     Horizon arc — positions the sun/moon by real sunrise/sunset
     ------------------------------------------------------------------------ */

  function updateHorizon(sunriseISO, sunsetISO, nextSunriseISO, nowISO) {
    const sunrise = parseLocal(sunriseISO);
    const sunset = parseLocal(sunsetISO);
    const nextSunrise = parseLocal(nextSunriseISO);
    const now = parseLocal(nowISO);

    els.sunrise.textContent = formatClock(sunrise);
    els.sunset.textContent = formatClock(sunset);

    let fraction, daytime;
    if (now >= sunrise && now <= sunset) {
      fraction = (now - sunrise) / (sunset - sunrise);
      daytime = true;
    } else if (now > sunset) {
      fraction = (now - sunset) / (nextSunrise - sunset);
      daytime = false;
    } else {
      // before today's sunrise — the night arc is nearly done, dawn is close
      fraction = 0.92;
      daytime = false;
    }
    fraction = Math.max(0, Math.min(1, fraction));

    els.dayProgress.textContent = `${Math.round(fraction * 100)}%`;

    const path = els.horizonPath;
    const len = path.getTotalLength();
    const point = path.getPointAtLength(fraction * len);
    els.horizonMarker.setAttribute("transform", `translate(${point.x},${point.y})`);

    els.horizon.querySelector(".horizon__label--rise .horizon__label-tag").textContent = daytime ? "Sunrise" : "Sunset";
    els.horizon.querySelector(".horizon__label--set .horizon__label-tag").textContent = daytime ? "Sunset" : "Next sunrise";
    if (!daytime) {
      els.sunrise.textContent = formatClock(sunset);
      els.sunset.textContent = formatClock(nextSunrise);
    }
  }

  function parseLocal(iso) {
    // Open-Meteo returns local (already offset) timestamps like "2026-07-30T14:00"
    return new Date(iso.replace(" ", "T"));
  }

  function formatClock(date) {
    let h = date.getHours();
    const m = String(date.getMinutes()).padStart(2, "0");
    const suffix = h >= 12 ? "pm" : "am";
    h = h % 12 || 12;
    return `${h}:${m}${suffix}`;
  }

  /* ------------------------------------------------------------------------
     Field notes — condition-specific, not generic filler
     ------------------------------------------------------------------------ */

  function renderNotes(cat, current, daily) {
    const temp = current.temperature_2m;
    const wind = current.wind_speed_10m;
    const uv = daily.uv_index_max?.[0];
    const rainChance = daily.precipitation_probability_max?.[0];

    const prevention = [];
    const lifestyle = [];

    const catNotes = {
      clear: {
        prevention: [
          uv >= 6 ? `UV is running <strong>${uv.toFixed(1)}</strong> — sunscreen and shade between late morning and mid-afternoon.` : "Low UV today — sun protection is optional but water is not.",
          "Clear skies cool fast after sunset — keep a layer nearby for the evening.",
        ],
        lifestyle: [
          "Good visibility for anything outdoors — runs, drives, rooftop plans.",
          "Open windows this afternoon; air quality tends to be best under clear sky.",
        ],
      },
      partly: {
        prevention: [
          "Cloud cover is inconsistent — sun exposure can spike when it breaks, so keep sunscreen on hand.",
          "Shadows will shift fast; not ideal for anything needing steady light.",
        ],
        lifestyle: [
          "Comfortable for most outdoor plans without full sun exposure.",
          "Good day for photography — moving light and cloud texture.",
        ],
      },
      overcast: {
        prevention: [
          "Flat, dim light — if you're driving at dawn or dusk, headlights help visibility.",
          "No direct UV risk, but skin still dries out in cold overcast air.",
        ],
        lifestyle: [
          "Even light all day — decent for focused indoor work near a window.",
          "Good conditions for a longer walk without heat or glare.",
        ],
      },
      fog: {
        prevention: [
          "<strong>Visibility is reduced</strong> — add extra following distance if driving, and use low beams, not high beams.",
          "Fog can linger into midday near water or low ground — don't assume it'll burn off fast.",
        ],
        lifestyle: [
          "Delay anything requiring long sightlines — flights, drone flying, scenic drives.",
          "Good, moody light for photography if you're on foot.",
        ],
      },
      rain: {
        prevention: [
          rainChance != null ? `<strong>${Math.round(rainChance)}% chance</strong> of rain today — carry something waterproof, not just an umbrella if wind picks up.` : "Carry something waterproof today.",
          wind >= 25 ? `Wind is around <strong>${Math.round(wind)} km/h</strong> — umbrellas may not hold up; a hooded layer is more reliable.` : "Watch for standing water on regular routes.",
        ],
        lifestyle: [
          "Traction drops fast on painted lines and metal surfaces — ease off if cycling or riding.",
          "Good excuse for the indoor plan you've been postponing.",
        ],
      },
      snow: {
        prevention: [
          "Roads and steps get slick before snow visibly accumulates — allow extra time to travel.",
          temp <= -5 ? `Air temperature is around <strong>${Math.round(temp)}°</strong> — cover extremities, frostbite risk rises quickly.` : "Layer up; wet snow cools you faster than dry cold.",
        ],
        lifestyle: [
          "Check on elderly neighbors if accumulation is expected overnight.",
          "Good day to batch errands into one trip rather than several.",
        ],
      },
      storm: {
        prevention: [
          "<strong>Thunderstorm conditions</strong> — postpone anything outdoors, especially near open ground or tall isolated objects.",
          "Unplug sensitive electronics if lightning is frequent nearby.",
        ],
        lifestyle: [
          "Keep phone charged in case of a short outage.",
          "Not a day for exposed rooftops, fields, or water — reschedule if you can.",
        ],
      },
    };

    const set = catNotes[cat] || catNotes.overcast;
    prevention.push(...set.prevention);
    lifestyle.push(...set.lifestyle);

    if (temp >= 35) prevention.unshift(`<strong>Heat advisory territory</strong> — ${Math.round(temp)}° means hydration and shade breaks, not just sunscreen.`);
    if (temp <= 0 && cat !== "snow") prevention.unshift(`Below freezing at <strong>${Math.round(temp)}°</strong> — watch for black ice even without visible snow.`);

    els.prevention.innerHTML = prevention.map((t) => `<li>${t}</li>`).join("");
    els.lifestyle.innerHTML = lifestyle.map((t) => `<li>${t}</li>`).join("");
  }

  /* ------------------------------------------------------------------------
     Forecast strip
     ------------------------------------------------------------------------ */

  function renderForecast(daily) {
    const days = daily.time.slice(1, 4); // skip today, show next 3
    const rows = days.map((dateStr, i) => {
      const idx = i + 1;
      const info = codeInfo(daily.weather_code[idx]);
      const date = new Date(dateStr + "T12:00:00");
      const dayLabel = date.toLocaleDateString(undefined, { weekday: "short" });
      const max = Math.round(daily.temperature_2m_max[idx]);
      const min = Math.round(daily.temperature_2m_min[idx]);
      return `<div class="forecast-row">
        <span class="forecast-row__day">${dayLabel}</span>
        <span class="forecast-row__cond">${info.label}</span>
        <span class="forecast-row__temps">${max}° <span>/ ${min}°</span></span>
      </div>`;
    });
    els.forecastRow.innerHTML = rows.join("");
  }

  /* ------------------------------------------------------------------------
     Sky + particle system
     ------------------------------------------------------------------------ */

  function applySky(skyState, silent) {
    els.body.dataset.sky = skyState;
    state.particleMode = skyState;
    seedParticles(skyState);
  }

  function setupCanvas() {
    const canvas = els.canvas;
    const ctx = canvas.getContext("2d");
    state.canvasCtx = ctx;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    loop();
  }

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function seedParticles(skyState) {
    const [cat] = skyState.split("-");
    const w = window.innerWidth;
    const h = window.innerHeight;
    const particles = [];

    if (cat === "clear" || cat === "partly") {
      // stars only render at night via draw-time check; clouds for partly
      if (skyState.endsWith("night")) {
        for (let i = 0; i < 90; i++) {
          particles.push({ type: "star", x: rand(0, w), y: rand(0, h * 0.7), r: rand(0.4, 1.6), tw: rand(0, Math.PI * 2), speed: rand(0.01, 0.03) });
        }
      }
      if (cat === "partly") {
        for (let i = 0; i < 5; i++) {
          particles.push(makeCloud(w, h));
        }
      }
    }

    if (cat === "overcast" || cat === "fog") {
      const count = cat === "fog" ? 6 : 8;
      for (let i = 0; i < count; i++) particles.push(makeCloud(w, h, cat === "fog"));
    }

    if (cat === "rain") {
      for (let i = 0; i < 4; i++) particles.push(makeCloud(w, h));
      for (let i = 0; i < 140; i++) particles.push(makeDrop(w, h));
    }

    if (cat === "snow") {
      for (let i = 0; i < 3; i++) particles.push(makeCloud(w, h));
      for (let i = 0; i < 110; i++) particles.push(makeFlake(w, h));
    }

    if (cat === "storm") {
      for (let i = 0; i < 6; i++) particles.push(makeCloud(w, h));
      for (let i = 0; i < 160; i++) particles.push(makeDrop(w, h, true));
      particles.push({ type: "lightning", timer: rand(2000, 5000), flash: 0 });
    }

    state.particles = particles;
  }

  function makeCloud(w, h, dense) {
    return {
      type: "cloud",
      x: rand(-100, w + 100),
      y: rand(h * 0.05, h * (dense ? 0.55 : 0.4)),
      scale: rand(0.7, 1.6),
      speed: rand(6, 16) / 1000,
      opacity: dense ? rand(0.35, 0.55) : rand(0.18, 0.34),
    };
  }
  function makeDrop(w, h, heavy) {
    return {
      type: "drop",
      x: rand(0, w),
      y: rand(0, h),
      len: rand(10, heavy ? 26 : 18),
      speed: rand(heavy ? 9 : 5, heavy ? 15 : 9),
      opacity: rand(0.2, 0.45),
    };
  }
  function makeFlake(w, h) {
    return {
      type: "flake",
      x: rand(0, w),
      y: rand(0, h),
      r: rand(1, 3.2),
      drift: rand(-0.4, 0.4),
      speed: rand(0.6, 1.8),
      sway: rand(0, Math.PI * 2),
    };
  }

  function loop() {
    draw();
    state.raf = requestAnimationFrame(loop);
  }

  function draw() {
    const ctx = state.canvasCtx;
    const w = window.innerWidth;
    const h = window.innerHeight;
    ctx.clearRect(0, 0, w, h);

    for (const p of state.particles) {
      switch (p.type) {
        case "star": drawStar(ctx, p); break;
        case "cloud": drawCloud(ctx, p, w); break;
        case "drop": drawDrop(ctx, p, h); break;
        case "flake": drawFlake(ctx, p, h); break;
        case "lightning": drawLightning(ctx, p, w, h); break;
      }
    }
  }

  function drawStar(ctx, p) {
    p.tw += p.speed;
    const alpha = 0.4 + Math.sin(p.tw) * 0.4;
    ctx.beginPath();
    ctx.fillStyle = `rgba(255,255,255,${Math.max(0, alpha)})`;
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawCloud(ctx, p, w) {
    p.x += p.speed;
    if (p.x > w + 160) p.x = -160;
    ctx.save();
    ctx.globalAlpha = p.opacity;
    ctx.fillStyle = "#FFFFFF";
    ctx.translate(p.x, p.y);
    ctx.scale(p.scale, p.scale);
    ellipseBlob(ctx);
    ctx.restore();
  }
  function ellipseBlob(ctx) {
    ctx.beginPath();
    ctx.ellipse(0, 0, 55, 22, 0, 0, Math.PI * 2);
    ctx.ellipse(38, -8, 38, 18, 0, 0, Math.PI * 2);
    ctx.ellipse(-38, -4, 34, 16, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawDrop(ctx, p, h) {
    p.y += p.speed;
    if (p.y > h) { p.y = -20; p.x = rand(0, window.innerWidth); }
    ctx.strokeStyle = `rgba(220,230,240,${p.opacity})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x - 2, p.y + p.len);
    ctx.stroke();
  }

  function drawFlake(ctx, p, h) {
    p.sway += 0.02;
    p.y += p.speed;
    p.x += Math.sin(p.sway) * p.drift;
    if (p.y > h) { p.y = -10; p.x = rand(0, window.innerWidth); }
    ctx.beginPath();
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawLightning(ctx, p, w, h) {
    p.timer -= 16;
    if (p.timer <= 0) {
      p.flash = 1;
      p.timer = rand(3000, 7000);
    }
    if (p.flash > 0) {
      ctx.fillStyle = `rgba(255,255,255,${p.flash * 0.5})`;
      ctx.fillRect(0, 0, w, h);
      p.flash -= 0.06;
      if (p.flash < 0) p.flash = 0;
    }
  }

  /* ------------------------------------------------------------------------
     Ambient local clock (updates once data is loaded, using the place's offset)
     ------------------------------------------------------------------------ */

  function startAmbientClock() {
    state.clockTimer = setInterval(() => {
      const now = new Date();
      let display;
      if (state.tzOffsetMinutes != null) {
        const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
        display = new Date(utcMs + state.tzOffsetMinutes * 60000);
      } else {
        display = now;
      }
      els.clock.textContent = formatClock(display);
    }, 1000);
  }

  /* ------------------------------------------------------------------------
     Small helpers
     ------------------------------------------------------------------------ */

  function setStatus(text, isError) {
    els.status.textContent = text;
    els.status.classList.toggle("is-visible", !!text);
    els.status.classList.toggle("is-error", !!isError);
  }

  function setLoading(isLoading) {
    els.body.dataset.loading = String(isLoading);
    els.searchBtn.disabled = isLoading;
    els.searchBtn.querySelector("span").textContent = isLoading ? "Scanning…" : "Scan sky";
  }

  document.addEventListener("DOMContentLoaded", init);
})();