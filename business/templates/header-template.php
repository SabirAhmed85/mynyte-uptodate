<?php ?>
<div id="header-bar" align-title="left" class="bar-positive initial-header-bar with-margin slow-trans">
    <span class="top-logo-container">
        <a href="https://www.mynyte.co.uk/business-staging/">
            <img src="https://www.mynyte.co.uk/business-staging/img/myday-logo.png" alt="MyNyte Business - Website Development in Bedfordshire &amp; Buckinghamshire" />
        </a>
        <h2>01234 24 55 54</h2>
        <ul class="trans main">
            <li class="close">
                Menu
                <i class="fa fa-times" onclick="hideMenu()"></i>
            </li>
            <li class="main-li slow-trans">
                <i class="fa fa-desktop"></i>
                <a href="https://www.mynyte.co.uk/business-staging/web/">Website Enhancements</a>
                <button onclick="showSubMenu(this)" data-class="web-enhancements"><i class="fa fa-sort-desc"></i></button>
                
                <ul class="inner-menu web-enhancements trans">
                    <li><a href="https://www.mynyte.co.uk/business-staging/web/appointment-booking-software.php"><i class="fa fa-calendar trans"></i>Booking &amp;<br /> Appointments</a></li>
                    <li><a href="https://www.mynyte.co.uk/business-staging/web/menu-and-catalogue-software.php"><i class="fa fa-book trans"></i>Menu &amp;<br /> Catalogues</a></li>
                    <li><a href="https://www.mynyte.co.uk/business-staging/web/customer-contact-software.php"><i class="fa fa-list-alt trans"></i>Customer<br /> Contact</a></li>
                    <li><a href="https://www.mynyte.co.uk/business-staging/web/live-chat-software.php"><i class="fa fa-headphones trans"></i>Live <br />Chat</a></li>
                    <li><a href="https://www.mynyte.co.uk/business-staging/web/business-management-software.php"><i class="fa fa-black-tie trans"></i>Business<br /> Management</a></li>
                </ul>
            </li>
            <li class="business-packages main-li slow-trans">
                <i class="fa fa-dropbox"></i>
                <a href="https://www.mynyte.co.uk/business-staging/business-packages/">Business Packages</a>
                <button onclick="showSubMenu(this)" data-class="business-packages"><i class="fa fa-sort-desc"></i></button>
                
                <ul class="inner-menu business-packages trans">
                    <li><a href="https://www.mynyte.co.uk/business-staging/business-packages/restaurant-package.php"><i class="fa fa-cutlery trans"></i>Restaurant<br /> Packages</a></li>
                    <li><a href="https://www.mynyte.co.uk/business-staging/business-packages/takeaway-package.php"><i class="fa fa-archive trans"></i>Takeaway<br /> Packages</a></li>
                    <li><a href="https://www.mynyte.co.uk/business-staging/business-packages/estate-letting-agent-package.php"><i class="fa fa-home trans"></i>Letting/Estate<br /> Agent Packages</a></li>
                    <li><a href="https://www.mynyte.co.uk/business-staging/business-packages/hairdresser-package.php"><i class="fa fa-scissors trans"></i>Hairdresser/Barber<br /> Packages</a></li>
                    <!--<li><a href="https://www.mynyte.co.uk/business-staging/business-packages/other-packages.php"><i class="fa fa-dropbox trans"></i>Other<br /> Packages</a></li>-->
                </ul>
            </li>
            <li class="main-li slow-trans">
                <i class="fa fa-bullhorn"></i>
                <a href="https://www.mynyte.co.uk/business-staging/business-promotion/">Business Promotion</a>
                <button onclick="showSubMenu(this)" data-class="business-promotion"><i class="fa fa-sort-desc"></i></button>
                
                <ul class="inner-menu business-promotion trans">
                    <li><a href="https://www.mynyte.co.uk/business-staging/business-promotion/the-mynyte-and-myday-apps.php"><i class="fa fa-mobile trans"></i>The MyNyte &amp; <br />MyDay Apps</a></li>
                    <li><a href="https://www.mynyte.co.uk/business-staging/business-promotion/website-design.php"><i class="fa fa-laptop trans"></i>Website<br /> Design</a></li>
                    <li><a href="https://www.mynyte.co.uk/business-staging/business-promotion/flyer-and-art-design.php"><i class="fa fa-paint-brush trans"></i>Flyer &amp;<br /> Art Design</a></li>
                    <li><a href="https://www.mynyte.co.uk/business-staging/business-promotion/social-media.php"><i class="fa fa-facebook-square trans"></i>Social<br /> Media</a></li>
                    <li><a href="https://www.mynyte.co.uk/business-staging/business-promotion/google-ranking-and-seo.php"><i class="fa fa-search trans"></i>SEO and<br /> Google</a></li>
                </ul>
            </li>
            <li class="contact main-li trans">
                <i class="fa fa-phone-square"></i>
                <a href="https://www.mynyte.co.uk/business-staging/contact-us.php">Contact Us</a>
            </li>
            <!--
            <li>
                <a>My Account</a>
            </li>
            -->
        </ul>
    </span>
    <button class="quote" onclick="toggleQuickContact()">Quick Quote</button>
    <button class="menu" onclick="showMenu()"><i class="fa fa-bars"></i></button>
</div>

<div class="contact-section header-contact-section trans">
    <div class="header-contact-section-inner trans">
  		<h4>Contact Us Online<i onclick="toggleQuickContact()" class="fa fa-times"></i></h4>
        <div class="slow-trans header-contact-inner-top">
            <p>For advice on your project, or a free consultation &amp; quote, please call:</p>
            <h4 class="second">01234 24 55 54</h4>
            <p>Or drop us a quick message:</p>
        </div>
        <form>
          <span class="success-span slow-trans">Thank you for contacting us. Your message has now been submitted, and one of our team members will be in touch with you shortly.</span>
          <span class="main-error-span slow-trans">There was a problem with some of the details you entered. Please correct the errors below and try again.</span>
          <div>
              <i class="fa fa-user"></i>
              <input type="text" placeholder="Your Name (required)" name="Name">
              <span class="error-span">
                <span>Please enter a valid name.</span>
              </span>
          </div>
          <div>
              <i class="fa fa-envelope-o"></i>
              <input type="text" placeholder="E-mail Address (required)" name="Email">
              <span class="error-span">
                <span>Please enter a valid e-mail.</span>
              </span>
          </div>
          <div class="phone-div">
              <i class="fa fa-phone"></i>
              <input type="text" placeholder="Phone Number" name="Phone">
              <span class="error-span">
                <span>Please enter a valid phone number.</span>
              </span>
          </div>
          <div>
              <i class="fa fa-black-tie"></i>
              <input type="text" placeholder="Company Name" name="Company">
          </div>
          <div class="textarea-div">
              <i class="fa fa-comment"></i>
              <textarea placeholder="Tell us a little about your Project (required)" name="Message"></textarea>
              <span class="error-span">
                <span>Please enter a message.</span>
              </span>
          </div>
          <button onclick="contactMyDay(this, event);">Contact</button>
        </form>
	</div>
</div>
<?php ?>
