//Selenium WebDriver.
//Para ejecutar: node test_login.js

const { Builder, By, until } = require('selenium-webdriver');

const BROWSERSTACK_USERNAME = process.env.BROWSERSTACK_USERNAME; //Username de BrowserStack
const BROWSERSTACK_ACCESS_KEY = process.env.BROWSERSTACK_ACCESS_KEY; // Access Key de BrowserStack
const FRONTEND_URL = process.env.FRONTEND_URL; // Tu dominio de Dokploy (debe ser HTTPS)

const TEST_USER = process.env.TEST_USER; 
const TEST_PASS = process.env.TEST_PASS; 


const capabilities = {
    'browserName': 'Chrome', 
    'platformName': 'android', 
    'deviceName': 'Samsung Galaxy S22', 
    'os': 'android',
    'os_version': '12.0',
    'project': 'EvrySync Dokploy',
    'build': 'Version 1.1 - Login Completo',
    'name': 'Prueba de Login Mobile E2E',
    'browserstack.debug': 'true',
    'browserstack.networkLogs': 'true'
};


async function runTest() {
    let driver;

    try {
        // Conexión al Hub de BrowserStack
        driver = await new Builder()
            .usingServer(`http://${BROWSERSTACK_USERNAME}:${BROWSERSTACK_ACCESS_KEY}@hub-cloud.browserstack.com/wd/hub`)
            .withCapabilities(capabilities)
            .build();
            

        console.log(`Driver inicializado en ${capabilities.deviceName}. Navegando a ${FRONTEND_URL}...`);

        // A. NAVEGAR a la URL desplegada
        await driver.get(FRONTEND_URL);

        // B. ESPERAR a que el formulario de Login sea visible
        const loginForm = By.css('form.login-form'); 
        await driver.wait(until.elementLocated(loginForm), 15000); 

        console.log("Página de Login cargada. Iniciando la secuencia de autenticación...");

        // C. INTERACTUAR Y AUTENTICARSE
        
        // 1. Ingresar Usuario (asume un input con id 'username' o 'email')
        const emailInput = await driver.findElement(By.id('email')); 
        await emailInput.sendKeys(TEST_USER);
        console.log("Usuario ingresado.");

        // 2. Ingresar Contraseña (asume un input con id 'password')
        const passwordInput = await driver.findElement(By.id('password'));
        await passwordInput.sendKeys(TEST_PASS);
        console.log("Contraseña ingresada.");

        // 3. Hacer clic en el botón de submit (asume un botón dentro del formulario)
        const submitButton = await driver.findElement(By.css('button[type="submit"]'));
        await submitButton.click();
        console.log("Botón de Login presionado. Esperando redirección...");

        // D. VERIFICAR ÉXITO (ASERCÍON FINAL)
        // Espera a que aparezca un elemento que SOLO es visible después de iniciar sesión.
        const dashboardHeader = By.css('.dashboard-header'); // REEMPLAZAR con una clase o ID de tu dashboard
        await driver.wait(until.elementLocated(dashboardHeader), 15000); 

        console.log("✅ ÉXITO: El elemento del Dashboard es visible. La prueba de conexión y login móvil es correcta.");


    } catch (e: any) {
        console.error('❌ FALLO: La prueba de Login falló. El error fue:', e.message);
        // Si la prueba falla, BrowserStack registrará la captura de pantalla en ese momento.
    } finally {
        if (driver) {
            // Cierra el dispositivo virtual en BrowserStack
            await driver.quit();
            console.log("Sesión de BrowserStack finalizada.");
        }
    }
}

runTest();
