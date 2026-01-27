import { useEffect, useMemo, useState } from "react";
import Typed from "typed.js";

const services = [
  {
    icon: "bx bx-code",
    title: "Front-End Development",
    description:
      "Build responsive and interactive UI with modern React patterns, CSS, and accessibility best practices.",
  },
  {
    icon: "bx bx-server",
    title: "Back-End Development",
    description:
      "Design scalable APIs with Node.js and Express, integrate databases, and keep performance in check.",
  },
  {
    icon: "bx bx-cloud-upload",
    title: "Deployment & DevOps",
    description:
      "Ship apps to Render, Vercel, or Netlify with sane CI/CD, environment config, and monitoring basics.",
  },
  {
    icon: "bx bx-data",
    title: "Database Management",
    description:
      "Model data for SQL and NoSQL stores, optimize queries, and keep migrations predictable.",
  },
  {
    icon: "bx bx-mobile-alt",
    title: "Responsive Design",
    description:
      "Craft mobile-first layouts that stay usable and performant across all breakpoints.",
  },
];

const skills = [
  { name: "HTML", percent: 95, color: "#e44d26" },
  { name: "CSS", percent: 80, color: "#2965f1" },
  { name: "JavaScript", percent: 70, color: "#f0db4f" },
  { name: "React", percent: 65, color: "#61dafb" },
  { name: "Node.js", percent: 80, color: "#43853d" },
  { name: "Python", percent: 85, color: "#3776ab" },
  { name: "Express", percent: 90, color: "#353535" },
  { name: "MongoDB", percent: 75, color: "#4db33d" },
  { name: "C", percent: 70, color: "#00599C" },
  { name: "Java", percent: 75, color: "#f89820" },
  { name: "Git", percent: 90, color: "#f1502f" },
  { name: "MySQL", percent: 30, color: "#00618A" },
  { name: "Flask", percent: 70, color: "#000000" },
  { name: "VS Code", percent: 95, color: "#007ACC" },
  { name: "D3.js", percent: 60, color: "#f9a03c" },
  { name: "Cloudinary", percent: 75, color: "#3448c5" },
  { name: "REST API", percent: 80, color: "#6c5ce7" },
  { name: "Bootstrap", percent: 90, color: "#7952b3" },
  { name: "Material UI", percent: 70, color: "#0081CB" },
  { name: "Tailwind CSS", percent: 80, color: "#38bdf8" },
  { name: "Firebase", percent: 60, color: "#FFCA28" },
  { name: "ANSYS HFSS", percent: 70, color: "#00C8FF" },
  { name: "Next.js", percent: 65, color: "#000000" },
  { name: "TypeScript", percent: 75, color: "#3178C6" },
  { name: "MATLAB", percent: 85, color: "#FF8C00" },
  { name: "JWT", percent: 80, color: "#00A884" },
  { name: "FastAPI", percent: 70, color: "#05998B" },
  { name: "Render", percent: 60, color: "#3B82F6" },
];

const experiences = [
  {
    title: "Summer Intern",
    company: "NIT Rourkela",
    duration: "May 2025 – Present",
    description:
      "Improved frontend design and performance for a microwave circuit simulation platform, collaborating closely with the product team.",
    link: "https://drive.google.com/file/d/17b2Qh3WIrpvdaj757NEnwCjIdK1jVc6p/view?usp=drive_link",
  },
];

const projects = [
  {
    title: "CircuitSim",
    description:
      "Interactive circuit simulator built with React and D3.js that performs DC, AC, and transient analysis with S-parameter visualizations.",
    image: "/css/circuitsim.png",
    demo: "https://circuit-simulator-51410.web.app/",
    repo: "https://github.com/sauravpanigrahi/circuit-simulator.git",
  },
  {
    title: "Moodigo - Ecommerce",
    description:
      "Mood-based e-commerce experience with secure flows for shoppers and admins to manage content and listings.",
    image: "/css/project3.png",
    demo: "https://moodigo-web-app.web.app/",
    repo: "https://github.com/sauravpanigrahi/Moodigo.git",
  },
  {
    title: "Homify - Hotel Listing",
    description:
      "Hotel and home listing site with a clean interface for tourists to discover stays and hosts to manage their properties.",
    image: "/css/project1.png",
    demo: "https://project-8um0.onrender.com",
    repo: "https://github.com/sauravpanigrahi/Homify.git",
  },
  {
    title: "Personal Portfolio",
    description:
      "Responsive portfolio showcasing projects, skills, and experience with a built-in contact flow.",
    image: "/css/project2.png",
    demo: "https://portfolio-tl9z.onrender.com/",
    repo: "https://github.com/sauravpanigrahi/Portfolio.git",
  },
];

const socialLinks = [
  { href: "https://github.com/sauravpanigrahi", icon: "bx bxl-github" },
  { href: "http://www.linkedin.com/in/saurav-panigrahi-21072b296", icon: "bx bxl-linkedin" },
  { href: "mailto:sauravpanigrahi2004@gmail.com", icon: "bx bxs-envelope" },
];

const contactChannels = [
  {
    icon: "bx bx-envelope",
    label: "Email",
    value: "sauravpanigrahi2004@gmail.com",
    href: "mailto:sauravpanigrahi2004@gmail.com",
  },
  {
    icon: "bx bxl-linkedin",
    label: "LinkedIn",
    value: "linkedin.com/in/saurav-panigrahi-21072b296",
    href: "http://www.linkedin.com/in/saurav-panigrahi-21072b296",
  },
  {
    icon: "bx bxl-github",
    label: "GitHub",
    value: "github.com/sauravpanigrahi",
    href: "https://github.com/sauravpanigrahi",
  },
];

function App() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState({ type: "", message: "" });
  const apiBaseUrl = useMemo(() => import.meta.env.VITE_API_BASE_URL || "", []);

  useEffect(() => {
    const typed = new Typed(".typed-text", {
      strings: ["Full-stack Developer", "Tech Explorer"],
      typeSpeed: 50,
      backSpeed: 90,
      backDelay: 900,
      loop: true,
    });
    return () => typed.destroy();
  }, []);

  useEffect(() => {
    const navbar = document.querySelector(".navbar");
    const onScroll = () => {
      if (window.scrollY > 50) {
        navbar?.classList.add("scrolled");
      } else {
        navbar?.classList.remove("scrolled");
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target.id === "skills") {
              entry.target.querySelectorAll(".progress-bar").forEach((bar) => {
                const width = bar.getAttribute("data-width");
                bar.style.width = `${width}%`;
              });
            }
            entry.target.classList.add("animate");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    document.querySelectorAll("section").forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    try {
      const res = await fetch(`${apiBaseUrl}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to send message");
      }

      setStatus({ type: "success", message: data.message || "Message sent successfully!" });
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Something went wrong." });
    }
  };

  return (
    <div className="app">
      <nav className="navbar navbar-expand-md navbar-dark bg-black border-bottom sticky-top">
        <div className="container-fluid">
          <a className="navbar-brand fw-bold text-info" href="#home">
            Portfolio
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav ms-auto me-5">
              <a className="nav-link" href="#home">
                Home
              </a>
              <a className="nav-link" href="#skills">
                Skills
              </a>
              <a className="nav-link" href="#services">
                Services
              </a>
              <a className="nav-link" href="#projects">
                Projects
              </a>
              {/* <a className="nav-link" href="#contact">
                Contact
              </a> */}
            </div>
          </div>
        </div>
      </nav>

      <main>
        <section id="home" className="hero-section">
          <div className="container">
            <div className="row align-items-center min-vh-80">
              <div className="col-lg-6 col-md-12 order-2 order-lg-1">
                <div className="hero-content">
                  <h3 className="greeting">Hello, it's me</h3>
                  <h1 className="name display-5 fw-bold">Saurav Panigrahi</h1>
                  <h3 className="role">
                    And I'm <span className="typed-text"></span>
                  </h3>
                  <p className="description text-justify">
                    I'm a passionate engineering student with a strong interest in full-stack web development
                    and modern technologies. I love building fast, scalable, and visually appealing web applications
                    that offer meaningful user experiences. Alongside development, I’m continuously exploring AI and
                    automation to understand how intelligent systems can solve real-world problems efficiently.
                  </p>
                  <a href="#about" className="btn btn-primary btn-lg mt-3">
                    More About Me
                  </a>
                  <div className="social-links mt-4">
                    {socialLinks.map((link) => (
                      <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                        <i className={`${link.icon}`}></i>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-md-12 order-1 order-lg-2 text-center">
                <div className="hero-image">
                  <img src="/css/image.jpg" alt="Saurav Panigrahi" className="profile-img" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="services-section py-5">
          <div className="container">
            <h2 className="section-title text-center mb-5">
              My <span className="text-primary">Services</span>
            </h2>
            <div className="row g-4">
              {services.map((service) => (
                <div className="col-lg-4 col-md-6" key={service.title}>
                  <div className="service-card h-100">
                    <i className={`${service.icon} service-icon`}></i>
                    <h4>{service.title}</h4>
                    <p>{service.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="skills" className="skills-section py-5">
          <div className="container">
            <h2 className="section-title text-center mb-5">
              My <span className="text-primary">Skills</span>
            </h2>
            <div className="row g-3">
              {skills.map((skill) => (
                <div className="col-lg-3 col-md-4 col-sm-6" key={skill.name}>
                  <div className="skill-item">
                    <h5>{skill.name}</h5>
                    <div className="progress">
                      <div
                        className="progress-bar"
                        data-width={skill.percent}
                        style={{ background: skill.color }}
                      >
                        {skill.percent}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="experience" className="experience-section py-4 min-vh-100">
          <div className="container">
            <h2 className="section-title text-center mb-5">
              My <span className="text-primary">Experience</span>
            </h2>
            <div className="row g-4">
              {experiences.map((exp) => (
                <div className="col-lg-5 col-md-8" key={exp.title}>
                  <div className="project-card service-card">
                    <div className="card-body pt-3">
                      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start mb-3 row duration">
                        <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                          <h5 className="card-title text-start">{exp.title}</h5>
                          <h6 className="text-primary text-start">{exp.company}</h6>
                        </div>
                        <div className="col-6">
                          <span className="badge bg-primary">{exp.duration}</span>
                        </div>
                      </div>
                      <p className="card-text text-start">{exp.description}</p>
                      {exp.link && (
                        <a
                          href={exp.link}
                          target="_blank"
                          rel="noreferrer"
                          className="btn d-inline-flex align-items-center gap-2 text-white px-3 py-2"
                          style={{
                            backgroundColor: "#6f42c1",
                            border: "none",
                            boxShadow: "0 4px 10px rgba(111, 66, 193, 0.3)",
                            fontSize: "1rem",
                          }}
                        >
                          <div>
                            <i className="bi bi-eye fs-5"></i>
                          </div>
                          <span className="d-none d-sm-inline">View Certificate</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="projects" className="projects-section py-4 min-vh-100">
          <div className="container">
            <h2 className="section-title text-center mb-5">
              My <span className="text-primary">Projects</span>
            </h2>
            <div className="row g-4 justify-content-center">
              {projects.map((project) => (
                <div className="col-lg-5 col-md-8" key={project.title}>
                  <div className="project-card service-card">
                    <img src={project.image} className="card-img-top" alt={project.title} />
                    <div className="card-body pt-3">
                      <h5 className="card-title">{project.title}</h5>
                      <p className="card-text text-justify">{project.description}</p>
                      <div className="icons d-flex flex align-items-start gap-2 mt-3">
                        <a href={project.demo} className="btn btn-primary" target="_blank" rel="noreferrer">
                          View Project
                        </a>
                        <a href={project.repo} target="_blank" rel="noreferrer">
                          <i className="bx bxl-github bx-md"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* <section id="contact" className="contact-section">
          <div className="container py-5">
            <h2 className="section-title text-center mb-5">
              Get In <span className="text-primary">Touch</span>
            </h2>
            <div className="contact-grid">
              <div className="contact-info">
                {contactChannels.map((channel) => (
                  <div className="contact-item" key={channel.label}>
                    <i className={channel.icon}></i>
                    <div className="contact-item-content">
                      <h4>{channel.label}</h4>
                      <p>
                        <a href={channel.href} className="text-decoration-none text-white">
                          {channel.value}
                        </a>
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="contact-form">
                <h3 className="mb-4">Contact Me</h3>
                {status.message && (
                  <div
                    className={`alert ${status.type === "success" ? "alert-success" : "alert-danger"}`}
                    role="alert"
                  >
                    {status.message}
                  </div>
                )}
                <form className="row g-3 needs-validation" noValidate onSubmit={handleSubmit}>
                  <div className="col-12 col-md-6">
                    <label htmlFor="name" className="form-label">
                      Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      placeholder="Enter your name"
                      required
                      value={form.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label htmlFor="phone" className="form-label">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      id="phone"
                      name="phone"
                      placeholder="Enter phone number"
                      required
                      value={form.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-12">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      placeholder="Enter your email"
                      required
                      value={form.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-12">
                    <label htmlFor="message" className="form-label">
                      Message
                    </label>
                    <textarea
                      className="form-control"
                      id="message"
                      name="message"
                      rows="4"
                      placeholder="Your message here..."
                      required
                      value={form.message}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn btn-primary w-100 py-2">
                      Send Message
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section> */}
      </main>

      <footer className="footer py-4">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <p>&copy; 2024 Saurav Panigrahi. All rights reserved.</p>
              <div className="footer-links">
                {socialLinks.map((link) => (
                  <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                    <i className={link.icon}></i>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

