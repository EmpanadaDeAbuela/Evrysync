//Selenium WebDriver.
//npm install selenium-webdriver typescript ts-node dotenv @types/node @types/selenium-webdriver
//npm i -D tsx
//npx ts-node test_login.ts  (no anda creo)
//Para ejecutar: npx tsx test_login.ts 

import { Builder, By, until, WebDriver, Capabilities } from 'selenium-webdriver';
import * as dotenv from "dotenv";
dotenv.config();


const BROWSERSTACK_USERNAME = process.env.BROWSERSTACK_USERNAME as string; 
const BROWSERSTACK_ACCESS_KEY = process.env.BROWSERSTACK_ACCESS_KEY as string; 
const FRONTEND_URL = process.env.FRONTEND_URL as string; 

const TEST_USER = process.env.TEST_USER as string; 
const TEST_PASS = process.env.TEST_PASS as string; 

if (!BROWSERSTACK_USERNAME || !BROWSERSTACK_ACCESS_KEY || !FRONTEND_URL || !TEST_USER || !TEST_PASS) {
    console.error("FATAL ERROR: Una o más variables de entorno (BROWSERSTACK_USERNAME, etc.) no están definidas en el archivo .env.");
    process.exit(1);
}


/*const capabilities: Capabilities = new Capabilities({
    'browserName': 'Chrome', 
    'deviceName': 'Samsung Galaxy S22', 
    'os': 'android',
    'os_version': '12.0',
    'project': 'EvrySync Dokploy',
    'build': 'Version 1.1 - Login Completo',
    'name': 'Prueba de Login Mobile E2E',
    'browserstack.debug': 'true',
    'browserstack.networkLogs': 'true'
});*/

  const capabilities = {
    browserName: "Chrome",
    browserVersion: "latest",
    "bstack:options": {
      os: "Windows",
      osVersion: "11",
      buildName: "evrysync-test",
      sessionName: "Login desde menú desplegable",
      userName: BROWSERSTACK_USERNAME,
      accessKey: BROWSERSTACK_ACCESS_KEY,
    },
  };

async function runTest(): Promise<void> { 

    let driver;
    try {
        console.log("Inicializando WebDriver...");
        
        driver = await new Builder()
        .usingServer("https://hub.browserstack.com/wd/hub")
        .withCapabilities(capabilities)
        .build();
            
        /*console.log(`Driver inicializado en ${capabilities.get('deviceName')}. Navegando a ${FRONTEND_URL}...`);*/

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
/*

import * as dotenv from "dotenv";
 
dotenv.config();
 
const USERNAME = process.env.BROWSERSTACK_USERNAME!;
const ACCESS_KEY = process.env.BROWSERSTACK_ACCESS_KEY!;
const APP_URL = "https://trythout.policloudservices.ipm.edu.ar";
 
async function runTest() {
  const capabilities = {
    browserName: "Chrome",
    browserVersion: "latest",
    "bstack:options": {
      os: "Windows",
      osVersion: "11",
      buildName: "Trythout BrowserStack Tests",
      sessionName: "Login desde menú desplegable",
      userName: USERNAME,
      accessKey: ACCESS_KEY,
    },
  };
 
  const driver = await new Builder()
    .usingServer("https://hub.browserstack.com/wd/hub")
    .withCapabilities(capabilities)
    .build();
 
  try {
    console.log("🔹 Abriendo Trythout...");
    await driver.get(APP_URL);
 
    // Esperar a que el menú (cruz blanca) sea visible
    console.log("🔹 Buscando el menú desplegable...");
    const menuBtn = await driver.wait(
      until.elementLocated(
        By.xpath("//button[contains(@class, 'dropdown-btn') or contains(., '✖') or contains(@aria-label, 'menu')]")
      ),
      10000
    );
    await menuBtn.click();
 
    // Espera extra tras abrir el menú (por animaciones)
    await driver.sleep(1500);
 
    // Esperar la opción "Log in"
    console.log("🔹 Buscando opción 'Log in'...");
    let loginOption;
    try {
      loginOption = await driver.wait(
        until.elementLocated(By.xpath("//a[contains(., 'Log in') or contains(., 'Sign in') or contains(., 'Iniciar sesión') or contains(., 'Acceder') or contains(., 'Entrar')]")),
        7000
      );
    } catch (e) {
      // Si no se encuentra <a>, probar con <button>
      loginOption = await driver.wait(
        until.elementLocated(By.xpath("//button[contains(., 'Login')]")),
        7000
      );
    }
    await loginOption.click();
 
    // Esperar a que cargue el formulario de login
    console.log("🔹 Esperando el formulario de login...");
    const usernameInput = await driver.wait(
      until.elementLocated(By.xpath("//*[@id='user']")),
      10000
    );
    const passwordInput = await driver.wait(
      until.elementLocated(By.xpath("//*[@id='password']")),
      10000
    );
 
    // Escribir credenciales
    console.log("🧠 Ingresando credenciales...");
    await usernameInput.sendKeys("alem");
    await passwordInput.sendKeys("Tomas369");
 
    // Clic en el botón de Login
    console.log("🚀 Enviando formulario...");
    let submitBtn;
    try {
      submitBtn = await driver.wait(
        until.elementLocated(By.xpath("//button[@type='submit']")),
        7000
      );
    } catch (e) {
      // Si no se encuentra por type, probar por texto
      submitBtn = await driver.wait(
        until.elementLocated(By.xpath("//button[contains(., 'Login') or contains(., 'Sign in') or contains(., 'Entrar') or contains(., 'Iniciar sesión') or contains(., 'Acceder')]")),
        7000
      );
    }
    await submitBtn.click();
 
    // Verificar login exitoso abriendo el menú y buscando 'Perfil'
    console.log("✅ Abriendo menú para verificar 'Perfil'...");
    const menuBtnAfterLogin = await driver.wait(
      until.elementLocated(
        By.xpath("//button[contains(@class, 'dropdown-btn') or contains(., '✖') or contains(@aria-label, 'menu')]")
      ),
      10000
    );
    await menuBtnAfterLogin.click();
    await driver.sleep(1500);
 
    await driver.wait(
      until.elementLocated(
        By.xpath("//*[contains(., 'Log out')]")
      ),
      10000
    );
 
    console.log("🎉 Login exitoso en Trythout y 'Perfil' visible en el menú.");
  } catch (error) {
    console.error("❌ Error durante el test:", error);
  } finally {
    await driver.quit();
  }
}
 
runTest();*/