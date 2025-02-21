import menuIcon from './assets/menu-icon.png';  // Adjust the path according to your project structure
import logo from './assets/logo.png';  // Adjust the path to where your logo image is stored

<>
      <header className="header">
        <div className="header-left">
          <img src={logo} alt="Logo" className="logo" />
        </div>
        <div className="header-center">
          <h1 className="header-title">Creative Abundance</h1>
        </div>
        <div className="header-right">
          <img src={menuIcon} alt="Menu" className="menu-icon" />
        </div>
      </header>

      <section className="banner">
        <div className="background">
          <h1 className="banner-text">
            Born Of Creative Abundance
          </h1>

          <p className="p-text">
            Made of Metal
          </p>
        </div>

      </section>
    </>
