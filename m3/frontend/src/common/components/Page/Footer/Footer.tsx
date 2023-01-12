export default function Footer() {
  const footerlist = [
    {
      key: "facebook",
      link: "#",
      icon: "bi bi-facebook",
    },
    {
      key: "instagram",
      link: "#",
      icon: "bi bi-instagram",
    },
    {
      key: "youtube",
      link: "#",
      icon: "bi bi-youtube",
    },
    {
      key: "twitter",
      link: "#",
      icon: "bi bi-twitter",
    },
    {
      key: "twitch",
      link: "#",
      icon: "bi bi-twitch",
    },
    {
      key: "web",
      link: "#",
      icon: "bi bi-globe",
    },
  ];

  return (
    <footer className="bg-dark py-3 mt-auto footer">
      <div className="d-flex justify-content-center">
        {footerlist.map((item) => (
          <a
            className="px-2 px-md-3 text-white"
            href={item.link}
            // target="_blank"
            key={item.key}
            rel="noreferrer"
          >
            <i className={item.icon}></i>
          </a>
        ))}
      </div>

      <div className="pt-2">
        <div className="text-white">
          © 2023 Copyright:
          <br></br>
          <a className="text-decoration-none text-white" href="#">
            &nbsp;SecurityAnalitica
          </a>
        </div>
      </div>
    </footer>
  );
}
