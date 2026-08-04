/* =========================
   SHARED NAVBAR
========================= */


function renderNavbar(){


    const navbar = document.getElementById("navbar");


    if(!navbar) return;



    navbar.innerHTML = `

    <nav class="navbar">


        <a href="index.html" class="logo">
            Insharah
        </a>



        <div class="nav-links">

            <a href="index.html">Home</a>

            <a href="about.html">About</a>

            <a href="projects.html">Projects</a>

            <a href="contact.html">Contact</a>

        </div>


    </nav>

    `;


}







/* =========================
   SHARED FOOTER
========================= */


function renderFooter(){


    const footer = document.getElementById("footer");


    if(!footer) return;



    footer.innerHTML = `


    <div class="footer-content">


        <p>
        © 2026 Insharah Irshad. Built with curiosity and code.
        </p>


    </div>


    `;


}








/* =========================
   PROJECT DATA
   Dynamic Rendering
========================= */



const projects = [


    {


        title:"AI ATS Resume Analyzer",

        description:
        "An AI-powered resume analysis workflow that evaluates ATS compatibility, identifies skill gaps, and generates recruiter-ready reports.",


        technologies:[
            "n8n",
            "LLMs",
            "Python",
            "Automation"
        ],


        link:"#"


    },



    {


        title:"AETHER Weather Engine",

        description:
        "A creative weather dashboard with animated environments, dynamic weather effects, and interactive visual experience.",


        technologies:[
            "HTML",
            "CSS",
            "JavaScript",
            "Three.js"
        ],


        link:"#"


    },



    {


        title:"AI SafeRoute",

        description:
        "An AI-based women safety solution concept focused on safer routes, risk awareness, and community feedback.",


        technologies:[
            "AI",
            "Maps API",
            "Machine Learning"
        ],


        link:"#"


    },



    {


        title:"Interactive To-Do Application",

        description:
        "A simple productivity application built with Python using task management logic and user interaction.",


        technologies:[
            "Python",
            "Functions",
            "Logic"
        ],


        link:"#"


    }


];







function renderProjects(){



    const container =
    document.getElementById("projectsContainer");



    if(!container) return;



    container.innerHTML = "";




    projects.forEach(project => {



        const card = document.createElement("div");


        card.className="project-card";



        card.innerHTML = `



        <h3>
        ${project.title}
        </h3>



        <p>
        ${project.description}
        </p>



        <div class="project-tech">

            ${project.technologies
            .map(
                tech =>
                `<span>${tech}</span>`
            )
            .join("")}

        </div>



        <a href="${project.link}" 
        class="project-link">

        View Project →

        </a>


        `;



        container.appendChild(card);



    });



}









/* =========================
   CONTACT FORM VALIDATION
========================= */



function validateContactForm(){



    const form =
    document.getElementById("contactForm");



    if(!form) return;



    form.addEventListener(
        "submit",
        function(event){


        event.preventDefault();



        const name =
        document.getElementById("name").value.trim();



        const email =
        document.getElementById("email").value.trim();



        const subject =
        document.getElementById("subject").value.trim();



        const message =
        document.getElementById("message").value.trim();



        const formMessage =
        document.getElementById("formMessage");




        if(
            name === "" ||
            email === "" ||
            subject === "" ||
            message === ""
        ){


            formMessage.style.color="#D48AA8";


            formMessage.textContent =
            "Please fill all fields.";


            return;


        }





        const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;



        if(!emailPattern.test(email)){


            formMessage.style.color="#D48AA8";


            formMessage.textContent =
            "Please enter a valid email address.";


            return;


        }






        formMessage.style.color="#9B6B8F";


        formMessage.textContent =
        "Message sent successfully!";



        form.reset();



    });


}








/* =========================
   INITIALIZE
========================= */


document.addEventListener(
"DOMContentLoaded",
()=>{


    renderNavbar();


    renderFooter();


    renderProjects();


    validateContactForm();



});