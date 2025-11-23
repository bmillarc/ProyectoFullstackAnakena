import { test, expect } from '@playwright/test';

// Cambia esto si tu puerto es distinto
const URL_BASE = 'http://localhost:5173';

test.describe('Autenticación y Navegación (E2E)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(URL_BASE);
  });

  test('Debe abrir el modal de Login al hacer clic en Iniciar Sesión', async ({ page }) => {
    //Busca el botón visible en el Navbar
    await page.getByRole('button', { name: 'Iniciar Sesión' }).click();

    //Verifica que el modal se abrió buscando su título
    const dialog = page.getByRole('dialog', { name: 'Iniciar Sesión' });
    await expect(dialog).toBeVisible();
  });

  test('Debe validar formato de email y campos requeridos', async ({ page }) => {
    await page.getByRole('button', { name: 'Iniciar Sesión' }).click();
    const dialog = page.getByRole('dialog');

    //Intentamos enviar vacío para ver validaciones
    await dialog.getByRole('button', { name: 'Iniciar Sesión' }).click();

    //Verificamos que el input de email tenga el foco o muestre error
    await dialog.getByLabel('Correo Electrónico').fill('email-invalido');
    await dialog.getByLabel('Contraseña').fill('123');
    await dialog.getByRole('button', { name: 'Iniciar Sesión' }).click();

    //Esperamos la alerta de error (MUI Alert)
    await expect(dialog.getByRole('alert')).toBeVisible();
  });

  test('Debe navegar entre Login y Registro dentro de los modales', async ({ page }) => {
    //Abrir Login
    await page.getByRole('button', { name: 'Iniciar Sesión' }).click();
    const loginDialog = page.getByRole('dialog', { name: 'Iniciar Sesión' });
    
    //Ir a Registro
    await loginDialog.getByRole('button', { name: 'Regístrate aquí' }).click();
    
    //Verificar que cambió a Registro
    const registerDialog = page.getByRole('dialog', { name: 'Crear Cuenta' });
    await expect(registerDialog).toBeVisible();
    await expect(loginDialog).toBeHidden();

    //Volver a Login
    await registerDialog.getByRole('button', { name: 'Inicia sesión aquí' }).click();
    await expect(loginDialog).toBeVisible();
  });

  test('Debe bloquear registro si las contraseñas no coinciden', async ({ page }) => {
    //Abrir registro directamente
    await page.getByRole('button', { name: 'Iniciar Sesión' }).click();
    await page.getByRole('button', { name: 'Regístrate aquí' }).click();

    const dialog = page.getByRole('dialog', { name: 'Crear Cuenta' });

    //Llenar datos
    await dialog.getByLabel('Nombre de Usuario').fill('Tester');
    await dialog.getByLabel('Correo Electrónico').fill('test@error.com');
    await dialog.getByLabel(/^Contraseña$/).fill('123456');
    await dialog.getByLabel('Confirmar Contraseña').fill('123457'); // Diferente

    await dialog.getByRole('button', { name: 'Registrarse' }).click();

    //Verificar mensaje de error exacto.
    await expect(dialog.getByRole('alert')).toContainText('Las contraseñas no coinciden');
  });

  test('Flujo Completo: Login exitoso y Cerrar Sesión', async ({ page }) => {
    //Ajusta la URL para interceptar el endpoint de login
    await page.route('**/api/auth/login', async route => {
      const json = {
        id: 1,
        username: 'UsuarioTest',
        email: 'test@anakena.com',
        csrfToken: 'fake-csrf-token'
      };
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        json
      });
    });
    // ----------------------------------------------------------------

    //Iniciar Sesión
    await page.getByRole('button', { name: 'Iniciar Sesión' }).click();
    const dialog = page.getByRole('dialog');
    
    await dialog.getByLabel('Correo Electrónico').fill('test@anakena.com');
    await dialog.getByLabel('Contraseña').fill('password123');
    await dialog.getByRole('button', { name: 'Iniciar Sesión' }).click();

    //Verificar que el usuario está logueado
    await expect(dialog).toBeHidden();
    
    //Debe aparecer el saludo "Hola, UsuarioTest"
    await expect(page.getByText('Hola, UsuarioTest')).toBeVisible();

    // Cerrar Sesión
    // ENCONTRAR EL BOTÓN DE PERFIL:
    const accountButton = page.locator('button').filter({ has: page.locator('svg[data-testid="AccountCircleIcon"]') }).first();

    await accountButton.click();

    //Verificar menú desplegable
    await page.getByRole('menuitem', { name: 'Cerrar Sesión' }).click();

    //Verificar que volvimos al estado inicial
    await expect(page.getByRole('button', { name: 'Iniciar Sesión' })).toBeVisible();
    await expect(page.getByText('Hola, UsuarioTest')).toBeHidden();
  });

});