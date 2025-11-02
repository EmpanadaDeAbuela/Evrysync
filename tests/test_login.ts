//Selenium WebDriver.
//npm install selenium-webdriver typescript ts-node dotenv @types/node @types/selenium-webdriver
//npm i -D tsx
//npx ts-node test_login.ts  (no anda creo)
//Para ejecutar: npx tsx test_login.ts 

import { Builder, By, until, WebDriver, Capabilities } from 'selenium-webdriver';
import 'dotenv/config';


const BROWSERSTACK_USERNAME = process.env.BROWSERSTACK_USERNAME as string; 
const BROWSERSTACK_ACCESS_KEY = process.env.BROWSERSTACK_ACCESS_KEY as string; 
const FRONTEND_URL = process.env.FRONTEND_URL as string; 

const TEST_USER = process.env.TEST_USER as string; 
const TEST_PASS = process.env.TEST_PASS as string; 

if (!BROWSERSTACK_USERNAME || !BROWSERSTACK_ACCESS_KEY || !FRONTEND_URL || !TEST_USER || !TEST_PASS) {
    console.error("FATAL ERROR: Una o más variables de entorno (BROWSERSTACK_USERNAME, etc.) no están definidas en el archivo .env.");
    process.exit(1);
}


const capabilities: Capabilities = new Capabilities({
    'browserName': 'Chrome', 
    'deviceName': 'Samsung Galaxy S22', 
    'os': 'android',
    'os_version': '12.0',
    'project': 'EvrySync Dokploy',
    'build': 'Version 1.1 - Login Completo',
    'name': 'Prueba de Login Mobile E2E',
    'browserstack.debug': 'true',
    'browserstack.networkLogs': 'true'
});


async function runTest(): Promise<void> {
    let driver: WebDriver | undefined;

    try {
        console.log("Inicializando WebDriver...");
        
        driver = await new Builder()
            .usingServer(`http://${BROWSERSTACK_USERNAME}:${BROWSERSTACK_ACCESS_KEY}@hub-cloud.browserstack.com/wd/hub`)
            .withCapabilities(capabilities)
            .build();
            
        console.log(`Driver inicializado en ${capabilities.get('deviceName')}. Navegando a ${FRONTEND_URL}...`);

        await driver.get(FRONTEND_URL);

        const loginForm = By.css('input.bs_user'); 
        await driver.wait(until.elementLocated(loginForm), 10000); 

        console.log("Página de Login cargada. Iniciando la secuencia de autenticación...");

        // C. INTERACTUAR Y AUTENTICARSE

        const emailInput = await driver.findElement(By.css('input.bs_user')); 
        await emailInput.sendKeys(TEST_USER);
        console.log("Usuario ingresado.");

        const passwordInput = await driver.findElement(By.css('input.bs_password'));
        await passwordInput.sendKeys(TEST_PASS);
        console.log("Contraseña ingresada.");

        const submitButton = await driver.findElement(By.css('button.bs_login'));
        await submitButton.click();
        console.log("Botón de Login presionado. Esperando redirección...");

        const dashboardHeader = By.css('.bs_config'); 
        await driver.wait(until.elementLocated(dashboardHeader), 10000); 

        console.log("✅ ÉXITO: El elemento del Dashboard es visible. La prueba de conexión y login móvil es correcta.");
        

    } catch (e: any) {
        console.error('❌ FALLO: La prueba de Login falló. El error fue:', e.message);
    } finally {
        if (driver) {
            await driver.quit();
            console.log("Sesión de BrowserStack finalizada.");
        }
    }
}

runTest();
