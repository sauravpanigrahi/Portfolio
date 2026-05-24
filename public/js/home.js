document.addEventListener("DOMContentLoaded", function () {
    if (typeof Typed !== "undefined") {
        new Typed(".text", {
            strings: ["Full-stack Developer", "a Tech Explorer"],
            typeSpeed: 60,
            backSpeed: 80,
            backDelay: 700,
            loop: true,
        });
    }

    document.querySelectorAll('.navbar a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            const targetId = this.getAttribute("href");
            if (targetId === "#") return;

            const target = document.querySelector(targetId);
            if (!target) return;

            e.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });

            const navbar = document.querySelector(".navbar-collapse");
            if (navbar && window.innerWidth < 768) {
                const bsCollapse = bootstrap.Collapse.getInstance(navbar);
                if (bsCollapse) {
                    bsCollapse.hide();
                }
            }
        });
    });

    function animateProgressBars() {
        document.querySelectorAll(".progress-bar").forEach((bar) => {
            const width = bar.getAttribute("data-width");
            if (width) {
                bar.style.width = width + "%";
            }
        });
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    if (entry.target.id === "skills") {
                        animateProgressBars();
                    }
                    entry.target.classList.add("animate");
                }
            });
        },
        { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    document.querySelectorAll("section").forEach((section) => {
        observer.observe(section);
    });

    window.addEventListener("scroll", () => {
        const navbar = document.querySelector(".navbar");
        if (navbar) {
            navbar.classList.toggle("scrolled", window.scrollY > 50);
        }
    });
});
