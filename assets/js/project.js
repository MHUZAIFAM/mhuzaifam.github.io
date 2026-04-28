AOS.init();
/* Project Cards */

const projectcards = document.querySelector(".projectcards");

// Array of object for projects
const projects = [
        {
    title: "Frailty Assessment System",
    cardImage: "assets/images/project-page/frailty-assessment.jpg",
    description: "Computer vision based frailty assessment system using Kinect V2 and machine learning for elderly healthcare. Developed at NCAI in collaboration with Juntendo University.",
    tagimg: "https://upload.wikimedia.org/wikipedia/commons/1/10/PyTorch_logo_icon.svg",
    Previewlink: "",
    Githublink: "https://github.com/MHUZAIFAM"
    },

    {
    title: "Brain Tumor Detection Using CNN",
    cardImage: "assets/images/project-page/brain-tumor-cnn.jpg",
    description: "Deep learning model to classify brain tumors from MRI images using convolutional neural networks.",
    tagimg: "https://upload.wikimedia.org/wikipedia/commons/2/2d/Tensorflow_logo.svg",
    Previewlink: "",
    Githublink: "https://github.com/MHUZAIFAM/BRAIN-TUMOR-MRI"
    },

    {
    title: "Plant Disease Detection using MobileNetV2",
    cardImage: "assets/images/project-page/plant-disease-mobilenet.jpg",
    description: "Deep learning model using MobileNetV2 and Grad-CAM visualization to classify plant diseases.",
    tagimg: "https://upload.wikimedia.org/wikipedia/commons/2/2d/Tensorflow_logo.svg",
    Previewlink: "",
    Githublink: "https://github.com/MHUZAIFAM/PLANTS-DISEASE"
    },

    {
    title: "CKD Diagnosis using Machine Learning",
    cardImage: "assets/images/project-page/ckd-diagnosis.jpg",
    description: "Machine learning based system for diagnosing Chronic Kidney Disease using multiple classifiers.",
    tagimg: "https://upload.wikimedia.org/wikipedia/commons/1/10/PyTorch_logo_icon.svg",
    Previewlink: "",
    Githublink: "https://github.com/MHUZAIFAM"
    },

    {
    title: "Web Browser Control using Hand Gestures",
    cardImage: "assets/images/project-page/gesture-browser-control.jpg",
    description: "Computer vision system to control browser actions using real-time hand gesture recognition.",
    tagimg: "https://upload.wikimedia.org/wikipedia/commons/3/38/OpenCV_logo_black.svg",
    Previewlink: "",
    Githublink: "https://github.com/MHUZAIFAM/Projects/tree/main/Web%20Browser%20Manipulation%20using%20Hand%20Gestures"
    },
  {
    title: "Snake Game",
    cardImage: "assets/images/project-page/Project1.png",
    description: "Snake Game Built for entertainment and concepts using python.",
    tagimg: "https://www.python.org/community/logos/python-logo-master-v3-TM.png", //tag image for python
    Previewlink: "",
    Githublink: "https://github.com/MHUZAIFAM/Projects/tree/main/Snake%20Game%20Python",
  },
  {
    title: "Customer Churn Prediction",
    cardImage: "assets/images/project-page/Project2.jpg",
    description: "Customer churn prediction uses data analytics to identify customers likely to leave, helping businesses retain them.",
    tagimg: "https://en.m.wikipedia.org/wiki/File:Jupyter_logo.svg", //tag image for Jupyter Notebook
    Previewlink: "",
    Githublink: "https://github.com/MHUZAIFAM/100DaysOfBytewise/tree/main/Project%20Customer%20Churn%20Prediction",
  },
  {
    title: "AI-Powered Traffic Flow and Accident Prediction System",
    cardImage: "assets/images/project-page/Project3.jpg",
    description: "Accident Prediction System using CNN and LSTMs",
    tagimg: "https://miro.medium.com/v2/resize:fit:1200/format:webp/1*J9N1MDLgHKX2VQH-XfOi7w.png", // Example CNN diagram
    Previewlink: "",
    Githublink: "https://github.com/MHUZAIFAM/100DaysOfBytewise/tree/main/Final%20Project",
  },
  {
    title: "Sales Data for a Retail Store",
    cardImage: "assets/images/project-page/Project4.jpg",
    description: "Exercise tracker built using basic redux.",
    tagimg: "https://miro.medium.com/max/2800/0*U2DmhXYumRyXH6X1.png",
    Previewlink: "",
    Githublink: "",
  },
  {
    title: "Face and Eye Detection",
    cardImage: "assets/images/project-page/Project5.png",
    description: "Detection of Human Face and Eyes to detect emotions",
    tagimg: "https://upload.wikimedia.org/wikipedia/commons/1/18/C_plusplus_logo.svg", // C++ logo
    Previewlink: "",
    Githublink: "https://github.com/MHUZAIFAM/FACE-AND-EYE-DETECTION-SYSTEM",
  },
  {
    title: "Fault Detection Of Induction Motor Using Machine Learning",
    cardImage: "assets/images/project-page/Project6.jpg",
    description: "Detection of various real-time faults in an induction motor and their prediction",
    tagimg: "https://upload.wikimedia.org/wikipedia/commons/2/21/MATLAB_Logo.svg", // MATLAB logo
    Previewlink: "",
    Githublink: "https://github.com/MHUZAIFAM/Fault-Detection-of-an-Induction-motor-using-machine-learning",
  },
  {
    title: "Acoustic Filter Design",
    cardImage: "assets/images/project-page/Project7.jpg",
    description: "Design of an acoustic filter to detect disease in chicks in poultry farms.",
    tagimg: "https://upload.wikimedia.org/wikipedia/commons/2/21/MATLAB_Logo.svg", // MATLAB logo
    Previewlink: "",
    Githublink: "https://github.com/MHUZAIFAM/Acoustic-Filter-Design",
  },
  {
    title: "Earthquake Detection System",
    cardImage: "assets/images/project-page/Project8.jpg",
    description: "Detection of earthquakes using vibration sensor and implementation using consoles and applications.",
    tagimgArduino: "https://upload.wikimedia.org/wikipedia/commons/4/47/Arduino_Logo.svg", // Arduino logo
    Previewlink: "",
    Githublink: "https://github.com/MHUZAIFAM/Earthquake-Detector",
  },
  {
    title: "Digital Twins",
    cardImage: "assets/images/project-page/Project9.jpg",
    description:"Developing a Digital twin of a 3-Phase Induction Motor",
    tagimg:
      "https://camo.githubusercontent.com/888e388801f947dec7c3d843942c277af25fe2b1aed1821542c4e711f210312a/68747470733a2f2f75706c6f61642e77696b696d656469612e6f72672f77696b6970656469612f636f6d6d6f6e732f7468756d622f632f63332f507974686f6e2d6c6f676f2d6e6f746578742e7376672f37363870782d507974686f6e2d6c6f676f2d6e6f746578742e7376672e706e67",
    Previewlink: "",
    Githublink: "https://github.com/MHUZAIFAM/DIGITAL-TWINS",
  },
  {
    title: "Water Level Indicator",
    cardImage: "assets/images/project-page/Project10.jpg",
    description: "Indication of Water Level Using Gate level modeling and basic ICs",
    tagimg: "https://camo.githubusercontent.com/888e388801f947dec7c3d843942c277af25fe2b1aed1821542c4e711f210312a/68747470733a2f2f75706c6f61642e77696b696d656469612e6f72672f77696b6970656469612f636f6d6d6f6e732f7468756d622f632f63332f507974686f6e2d6c6f676f2d6e6f746578742e7376672f37363870782d507974686f6e2d6c6f676f2d6e6f746578742e7376672e706e67",
    Previewlink: "",
    Githublink: "https://github.com/MHUZAIFAM/WATER-LEVEL-INDICATOR",
  },
  {
    title: "Temperature Control Using PID",
    cardImage: "assets/images/project-page/Project11.jpg",
    description: "Controlling temperature in a Green House using PID Controller",
    tagimg:"https://cdn-images-1.medium.com/max/1200/1*iDQvKoz7gGHc6YXqvqWWZQ.png",
    Previewlink: "",
    Githublink: "https://github.com/MHUZAIFAM/Temperature-Control-using-PID-Controller",
  },
  {
    title: "Heart Rate Monitoring System",
    cardImage: "assets/images/project-page/Project12.png",
    description: "Using transistors and OP-Amps to measure Human Heart Rate.",
    tagimg:"",
    Previewlink: "",
    Githublink: "",
  },
  {
    title: "IoT Based Battery Health Monitoring System",
    cardImage: "assets/images/project-page/Project13.png",
    description: "Using Arduino IDE to meaure Battery Healths.",
    tagimg:"",
    Previewlink: "",
    Githublink: "",
  },
  {
    title: "Buck Converter",
    cardImage: "assets/images/project-page/Project14.jpg",
    description: "Using Electronics to measure Voltage and designing a Buck Converter.",
    tagimg:"",
    Previewlink: "",
    Githublink: "",
  },
];

// function for rendering project cards data
const showCards = () => {
  let output = "";
  projects.forEach(({ title, cardImage, Previewlink, Githublink }) => {
    output += `       
        <div class="column skill-card card" style="margin: 15px"data-aos="zoom-in-up" data-aos-easing="linear" data-aos-delay="300" data-aos-duration="600" >
          <div class="wrapper" style="background: url(${cardImage}) center / cover no-repeat;">
            <div class="header">
            </div>
            <div class="data">
              <div class="content">
              <div class="title-div">
                <h1 class="title"><a href="#">${title}</a></h1>
                </div>
            <ul class="menu-content"><br>
                  <li><a href="${Previewlink}" class="social-icon"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="25" viewBox="0 0 30 28" fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-monitor"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg></a></li>
                  <li><a href="${Githublink}" class="social-icon"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="25" viewBox="0 0 30 28" fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-github"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg></a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>`;
  });
  projectcards.innerHTML = output;
};
document.addEventListener("DOMContentLoaded", showCards);

function myFunction() {
  // Declare variables
  var input, button, i, skillcard, card, title;
  input = document.getElementById("myInput").value;
  input = input.toUpperCase();
  skillcard = document.getElementsByClassName("skill-card");
  card = document.getElementsByClassName("card");
  title = document.getElementsByClassName("title");

  // Loop through all list items, and hide those who don't match the search query
  for (i = 0; i < button.length; i++) {
    if (
      button[i].innerHTML.toUpperCase().includes(input) ||
      title[i].innerHTML.toUpperCase().includes(input)
    ) {
      skillcard[i].style.display = "";
      card[i].style.display = "";
    } else {
      skillcard[i].style.display = "none";
      card[i].style.display = "none";
    }
  }
}
