import Logo from "../img/logo.png"

const Footer = () => {
    return (
        <footer>
            <img src={Logo} alt="Blog logo"></img>
            <span>Made with 🖤 and <b>React.js</b></span>
        </footer>
    );
}
 
export default Footer;