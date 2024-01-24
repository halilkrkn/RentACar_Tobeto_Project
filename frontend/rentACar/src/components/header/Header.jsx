import React, { useEffect, useRef, useState } from "react";

import { Container, Row, Col } from "reactstrap";
import { Link, NavLink } from "react-router-dom";
import "../../styles/header.css";

import logo from "../../assets/all-images/logo.png";
import mobilLogo from "../../assets/all-images/mobil_logo.png";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";
import turkey from "../../assets/all-images/tr.png";
import england from "../../assets/all-images/en.png";
import { NavDropdown } from "react-bootstrap";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const langSelect = (eventKey) => {
  i18n.changeLanguage(eventKey);
};

function Header() {
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const [showUi, setShowUi] = useState(true);
  const { details, status, error } = useSelector((state) => state.userDetail);
  const [token, setToken] = useState("");

  const toggleMenu = () => menuRef.current.classList.toggle("menu__active");

  const { t } = useTranslation();

  const navLinks = [
    {
      path: "/home",
      display: t("home"),
    },
    {
      path: "/about",
      display: t("about"),
    },
    {
      path: "/cars",
      display: t("cars"),
    },

    {
      path: "/campaigns",
      display: t("campaigns"),
    },
    {
      path: "/contact",
      display: t("contact"),
    },
  ];

  useEffect(() => {
    // JWT'den yetkilendirme bilgilerini okuma işlemi
    const storedJWT = localStorage.getItem("access_token");
    if (storedJWT) {
      setToken(storedJWT);
      setShowUi(false);
    } else {
      setShowUi(true);
    }
  }, []);

  const handleLogout = async () => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      // Çıkış endpoint'i
      const response = await fetch("http://localhost:8080/api/v1/logout", {
        method: "POST",
        headers: headers,
      });
      // Başarılı bir çıkış durumunda, local storage'daki token'ı sil
      if (response.ok) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        // Kullanıcıyı login sayfasına yönlendir
        Cookies.remove("remember-me");
        setShowUi(true); // Kullanıcı çıkış yaptığında showUi'yi true yap
        navigate("/login");
      } else {
        console.error("Çıkış işlemi başarısız.");
      }
    } catch (error) {
      console.error("Çıkış işlemi sırasında bir hata oluştu:", error);
    }
  };

  return (
    <header className="header">
      {/* ============ header top ============ */}
      <div className="header__top">
        <Container>
          <Row>
            <Col lg="6" md="6" sm="6">
              <div className="header__top__left">
                <span>{t("needhelp")}</span>
                <span className="header__top__help">
                  <i className="ri-phone-fill"></i> +1-202-555-0149
                </span>
              </div>
            </Col>

            <Col lg="6" md="6" sm="6">
              <div className="header__top__right d-flex align-items-center justify-content-end gap-3">
                {showUi ? (
                  <>
                    <Link
                      to="/login"
                      className="d-flex align-items-center gap-1"
                    >
                      <i className="ri-login-circle-line"></i>
                      {t("login")}
                    </Link>

                    <Link
                      to="/sign-up"
                      className="d-flex align-items-center gap-1"
                    >
                      <i className="ri-user-line"></i> {t("signup")}
                    </Link>
                  </>
                ) : (
                  <div>
                    <img
                      src="https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.webp"
                      alt={details.username}
                      className="header__user-image"
                    />
                    <span className="header__username">{details.username}</span>
                    <button
                      className="header__logout-btn btn"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
                <div className="vr" />
                <NavDropdown
                  menuVariant="dark"
                  //title={t("lang")}
                  title={
                    i18n.language === "en" ? (
                      <img width={24} src={england} />
                    ) : i18n.language === "tr" ? (
                      <img width={24} src={turkey} />
                    ) : // Handle other languages if needed
                    null
                  }
                  id="nav-dropdown"
                  onSelect={langSelect}
                >
                  {i18n.language === "en" ? (
                    <NavDropdown.Item eventKey="tr">
                      <img width={16} src={turkey} /> {t("tr-TR")}
                    </NavDropdown.Item>
                  ) : i18n.language === "tr" ? (
                    <NavDropdown.Item eventKey="en">
                      <img width={16} src={england} /> {t("en-US")}
                    </NavDropdown.Item>
                  ) : // Handle other languages if needed
                  null}
                </NavDropdown>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* =============== header middle =========== */}
      <div className="header__middle">
        <Container>
          <Row>
            <Col lg="4" md="3" sm="4">
              <div className="logo">
                <h1>
                  <Link to="/home" className="d-flex align-items-center gap-2">
                    <img width={125} src={logo} />
                  </Link>
                </h1>
              </div>
            </Col>

            <Col lg="3" md="3" sm="4">
              <div className="header__location d-flex align-items-center gap-2">
                <span>
                  <i className="ri-earth-line"></i>
                </span>
                <div className="header__location-content">
                  <h4>{t("country")}</h4>
                  <h6>
                    {t("city")}, {t("country")}
                  </h6>
                </div>
              </div>
            </Col>

            <Col lg="3" md="3" sm="4">
              <div className="header__location d-flex align-items-center gap-2">
                <span>
                  <i className="ri-time-line"></i>
                </span>
                <div className="header__location-content">
                  <h4>{t("workingdays")}</h4>
                  <h6>{t("hours")}</h6>
                </div>
              </div>
            </Col>

            <Col
              lg="2"
              md="3"
              sm="0"
              className=" d-flex align-items-center justify-content-end "
            >
              <button className="header__btn btn ">
                <Link to="/contact">
                  <i className="ri-phone-line"></i> {t("requestacall")}
                </Link>
              </button>
            </Col>
          </Row>
        </Container>
      </div>

      {/* ========== main navigation =========== */}

      <div className="main__navbar">
        <Container>
          <div className="navigation__wrapper d-flex align-items-center justify-content-between">
            <span className="mobile__menu">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="32"
                height="32"
                fill="rgba(255,255,255,1)"
                onClick={toggleMenu}
              >
                <path d="M3 4H21V6H3V4ZM3 11H21V13H3V11ZM3 18H21V20H3V18Z"></path>
              </svg>
            </span>

            <div className="mobile__logo text-center d-lg-none d-md-none d-sm-block">
              <h1>
                <Link to="/home" className="d-flex align-items-center gap-2">
                  <img width={75} src={mobilLogo} alt="Mobile Logo" />
                </Link>
              </h1>
            </div>

            {/* Login (Right Side) */}
            <div className="ml-auto  d-lg-none d-md-none d-sm-block">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="32"
                height="32"
                fill="rgba(255,255,255,1)"
              >
                <path d="M10 11V8L15 12L10 16V13H1V11H10ZM2.4578 15H4.58152C5.76829 17.9318 8.64262 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C8.64262 4 5.76829 6.06817 4.58152 9H2.4578C3.73207 4.94289 7.52236 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C7.52236 22 3.73207 19.0571 2.4578 15Z"></path>
              </svg>
            </div>

            <div className="navigation" ref={menuRef} onClick={toggleMenu}>
              <div className="menu">
                {navLinks.map((item, index) => (
                  <NavLink
                    to={item.path}
                    className={(navClass) =>
                      navClass.isActive ? "nav__active nav__item" : "nav__item"
                    }
                    key={index}
                  >
                    {item.display}
                  </NavLink>
                ))}
              </div>
            </div>

            <div className="nav__right">
              <div className="search__box">
                <input type="text" placeholder={t("search")} />
                <span>
                  <i className="ri-search-line"></i>
                </span>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </header>
  );
}

export default Header;
