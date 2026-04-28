/*Research Details Table*/

const researchTable = document.querySelector(".main");

const research = [
      {
    title: "Markerless Vision-Based Physical Frailty Assessment System for Older Adults",
    authors: "Muhammad Huzaifa",
    conferences: "MDPI AI Journal",
    researchYr: 2025,
    citebox: "popup1",
    image: "assets/images/research-page/FRAILTY.png",
    citation: {
    vancouver:
    "Huzaifa M, Ali W, Iqbal KF, Ahmad I, Ayaz Y, Taimur H, Shirayama Y, Yuasa M. A Markerless Vision-Based Physical Frailty Assessment System for the Older Adults. AI. 2025;6:224. https://doi.org/10.3390/ai6090224"
    },
    abstract:
    "The geriatric syndrome known as frailty is characterized by diminished physiological reserves and heightened susceptibility to adverse health outcomes. This work presents a fully automated computer vision-based system for assessing frailty through functional tests such as Walking Speed, Timed Up and Go (TUG), Functional Reach, Seated Forward Bend, Standing on One Leg, and Grip Strength. Using Kinect V2 depth and joint coordinate data, machine learning models analyze patient performance to provide real-time, objective frailty assessment. The system removes observer dependency and improves scalability for clinical and remote healthcare applications.",
    absbox: "absPopup1",
    },

      {
    title: "Fault Detection of Induction Motor using Digital Twin and Machine Learning",
    authors: "Muhammad Huzaifa",
    conferences: "Adaptive Signal Processing Lab, NUST",
    researchYr: 2024,
    citebox: "popup2",
    image: "assets/images/research-page/IMDT.jpg",
    citation: {
    vancouver:
    "Huzaifa M. Fault Detection of Induction Motor using Digital Twin and Machine Learning. NUST Research Project 2024."
    },
    abstract:
    "This research developed a digital twin model for monitoring the operational behavior of an induction motor using real-time sensor data. Machine learning techniques were applied to analyze vibration, temperature, and current signals to detect anomalies and predict faults. The system enables predictive maintenance and improved reliability in industrial motor systems.",
    absbox: "absPopup2",
    },

     {
    title: "Design of a 7-Element Circularly Polarized Antenna Array",
    authors: "Muhammad Huzaifa",
    conferences: "TUIL Research Lab, NUST",
    researchYr: 2023,
    citebox: "popup3",
    image: "assets/images/research-page/HFSS.jpg",
    citation: {
    vancouver:
    "Huzaifa M. Design of a 7-Element Circularly Polarized Antenna Array using HFSS Simulation. 2023."
    },
    abstract:
    "This research focused on designing and analyzing circularly polarized antenna arrays using ANSYS HFSS simulation software. The work involved optimizing element spacing, improving gain, and minimizing coupling between antenna elements to enhance communication system performance.",
    absbox: "absPopup3",
    },

    {
    title: "Network Protocol Analysis and Communication Systems",
    authors: "Muhammad Huzaifa",
    conferences: "Optical Networking and Technologies Lab, NUST",
    researchYr: 2023,
    citebox: "popup4",
    image: "assets/images/research-page/CASSINI.jpg",
    citation: {
    vancouver:
    "Huzaifa M. Network Communication Protocol Analysis and Implementation using Cisco Packet Tracer. 2023."
    },
    abstract:
    "This research involved analyzing network communication protocols and implementing network topologies using Cisco Packet Tracer and open-source networking tools. The study focused on improving understanding of node communication, traffic flow, and protocol behavior in distributed networks.",
    absbox: "absPopup4",
    },

];
AOS.init();
const fillData = () => {
  let output = "";
  research.forEach(
    ({
      image,
      title,
      authors,
      conferences,
      researchYr,
      citebox,
      citation,
      absbox,
      abstract,
    }) =>
      (output += `
            <tr data-aos="zoom-in-left"> 
                <td class="imgCol"><img src="${image}" class="rImg"></td>
                <td class = "researchTitleName">
                    <div class="img-div">
                        <span class="imgResponsive">
                            <img src="${image}" class="imgRes">
                        </span>
                    </div>
                    <a href="#0" class="paperTitle"> ${title} </a> 
                    <div class = "authors"> ${authors} </div> 
                    
                    <div class="rConferences"> ${conferences} 
                        <div class="researchY">${researchYr}</div>
                    </div>
                    
                    <!--CITE BUTTON-->
                    <div class="d-flex" style="margin-right:5%;">
                        <button class="button button-accent button-small text-right button-abstract " type="button" data-toggle="collapse" data-target="#${absbox}" aria-expanded="false" aria-controls="${absbox}">
                            ABSTRACT
                        </button>
                
                        <button class="button button-accent button-small text-right button-abstract " type="button" data-toggle="collapse" data-target="#${citebox}" aria-expanded="false" aria-controls="${citebox}">
                            CITE
                        </button>
                    </div>
                    <div id="${absbox}" class="collapse" aria-labelledby="headingTwo" data-parent=".collapse">
                        <div class="card-body">
                            ${abstract}    
                        </div>
                    </div>
                    <div id="${citebox}" class="collapse" aria-labelledby="headingTwo" data-parent=".collapse">
                        <div class="card-body">
                            ${citation.vancouver}    
                        </div>
                    </div>
                </td>
            </tr>`)
  );
  researchTable.innerHTML = output;
};
document.addEventListener("DOMContentLoaded", fillData);
