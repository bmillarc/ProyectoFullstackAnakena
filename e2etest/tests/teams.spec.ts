import { test, expect } from '@playwright/test';

const URL_BASE = 'http://localhost:5173';
const API_BASE = 'http://localhost:3001/api';

test.describe('CRUD de Equipos (E2E)', () => {

  test.beforeEach(async ({ page, request }) => {
    await page.goto(URL_BASE);

    //Limpiar equipos de prueba anteriores (IDs 995-999)
    const testIds = [995, 996, 997, 998, 999];
    for (const id of testIds) {
      try {
        await request.delete(`${API_BASE}/teams/${id}`);
      } catch {
        // Ignorar si el equipo no existe
      }
    }
  });

  test('Debe listar equipos vacíos inicialmente (READ)', async ({ request }) => {
    //Obtener lista de equipos
    const response = await request.get(`${API_BASE}/teams`);

    expect(response.status()).toBe(200);
    const teams = await response.json();

    //Verificar que es un array (puede estar vacío o con datos)
    expect(Array.isArray(teams)).toBeTruthy();
  });

  test('Debe crear un nuevo equipo (CREATE)', async ({ request }) => {
    const newTeam = {
      id: 999,
      sport: 'Fútbol',
      name: 'Equipo Test E2E',
      category: 'Masculino',
      description: 'Equipo creado mediante prueba E2E',
      founded: '2024',
      captain: 'Capitán Test',
      playersCount: 15,
      achievements: ['Test Achievement'],
      nextMatch: {
        id: 1,
        date: '2025-01-15',
        opponent: 'Rival Test',
        location: 'Estadio Test',
        time: '15:00'
      },
      image: '/images/test-team.jpg'
    };

    //Crear equipo
    const response = await request.post(`${API_BASE}/teams`, {
      data: newTeam
    });

    expect(response.status()).toBe(201);
    const createdTeam = await response.json();

    //Verificar que el equipo fue creado correctamente
    expect(createdTeam.id).toBe(newTeam.id);
    expect(createdTeam.name).toBe(newTeam.name);
    expect(createdTeam.sport).toBe(newTeam.sport);
    expect(createdTeam.category).toBe(newTeam.category);
  });

  test('Debe leer un equipo específico por ID (READ)', async ({ request }) => {
    //Primero crear un equipo
    const testTeam = {
      id: 998,
      sport: 'Básquetbol',
      name: 'Equipo Lectura Test',
      category: 'Femenino',
      description: 'Equipo para probar lectura',
      founded: '2023',
      captain: 'Capitana Test',
      playersCount: 12,
      achievements: [],
      nextMatch: {
        id: 2,
        date: '2025-02-01',
        opponent: 'Rival Lectura',
        location: 'Cancha Test',
        time: '18:00'
      },
      image: '/images/test-read.jpg'
    };

    await request.post(`${API_BASE}/teams`, { data: testTeam });

    //Leer el equipo por ID
    const response = await request.get(`${API_BASE}/teams/${testTeam.id}`);

    expect(response.status()).toBe(200);
    const team = await response.json();

    expect(team.id).toBe(testTeam.id);
    expect(team.name).toBe(testTeam.name);
  });

  test('Debe actualizar un equipo existente (UPDATE)', async ({ request }) => {
    //Crear equipo inicial
    const initialTeam = {
      id: 997,
      sport: 'Vóleibol',
      name: 'Equipo Original',
      category: 'Mixto',
      description: 'Descripción original',
      founded: '2022',
      captain: 'Capitán Original',
      playersCount: 10,
      achievements: [],
      nextMatch: {
        id: 3,
        date: '2025-03-01',
        opponent: 'Rival Original',
        location: 'Lugar Original',
        time: '16:00'
      },
      image: '/images/original.jpg'
    };

    await request.post(`${API_BASE}/teams`, { data: initialTeam });

    //Actualizar equipo
    const updatedData = {
      name: 'Equipo Actualizado',
      description: 'Descripción actualizada',
      playersCount: 14
    };

    const response = await request.put(`${API_BASE}/teams/${initialTeam.id}`, {
      data: updatedData
    });

    expect(response.status()).toBe(200);
    const updatedTeam = await response.json();

    //Verificar que los campos fueron actualizados
    expect(updatedTeam.name).toBe(updatedData.name);
    expect(updatedTeam.description).toBe(updatedData.description);
    expect(updatedTeam.playersCount).toBe(updatedData.playersCount);

    //Verificar que otros campos se mantienen
    expect(updatedTeam.id).toBe(initialTeam.id);
    expect(updatedTeam.sport).toBe(initialTeam.sport);
  });

  test('Debe eliminar un equipo (DELETE)', async ({ request }) => {
    //Crear equipo para eliminar
    const teamToDelete = {
      id: 996,
      sport: 'Tenis',
      name: 'Equipo a Eliminar',
      category: 'Masculino',
      description: 'Este equipo será eliminado',
      founded: '2021',
      captain: 'Capitán Temporal',
      playersCount: 8,
      achievements: [],
      nextMatch: {
        id: 4,
        date: '2025-04-01',
        opponent: 'Rival Temporal',
        location: 'Cancha Temporal',
        time: '14:00'
      },
      image: '/images/temp.jpg'
    };

    await request.post(`${API_BASE}/teams`, { data: teamToDelete });

    //Eliminar equipo
    const deleteResponse = await request.delete(`${API_BASE}/teams/${teamToDelete.id}`);

    expect(deleteResponse.status()).toBe(204);

    //Verificar que el equipo fue eliminado
    const getResponse = await request.get(`${API_BASE}/teams/${teamToDelete.id}`);
    expect(getResponse.status()).toBe(404);
  });

  test('Flujo completo CRUD: Crear, Leer, Actualizar y Eliminar', async ({ request }) => {
    const teamId = 995;

    // 1. CREATE
    const newTeam = {
      id: teamId,
      sport: 'Handball',
      name: 'Equipo CRUD Completo',
      category: 'Femenino',
      description: 'Equipo para flujo CRUD completo',
      founded: '2024',
      captain: 'Capitana CRUD',
      playersCount: 11,
      achievements: ['Primera prueba'],
      nextMatch: {
        id: 5,
        date: '2025-05-01',
        opponent: 'Rival CRUD',
        location: 'Estadio CRUD',
        time: '17:00'
      },
      image: '/images/crud.jpg'
    };

    const createResponse = await request.post(`${API_BASE}/teams`, { data: newTeam });
    expect(createResponse.status()).toBe(201);

    // 2. READ
    const readResponse = await request.get(`${API_BASE}/teams/${teamId}`);
    expect(readResponse.status()).toBe(200);
    const readTeam = await readResponse.json();
    expect(readTeam.name).toBe(newTeam.name);

    // 3. UPDATE
    const updateResponse = await request.put(`${API_BASE}/teams/${teamId}`, {
      data: { name: 'Equipo CRUD Modificado', playersCount: 13 }
    });
    expect(updateResponse.status()).toBe(200);
    const updatedTeam = await updateResponse.json();
    expect(updatedTeam.name).toBe('Equipo CRUD Modificado');
    expect(updatedTeam.playersCount).toBe(13);

    // 4. DELETE
    const deleteResponse = await request.delete(`${API_BASE}/teams/${teamId}`);
    expect(deleteResponse.status()).toBe(204);

    // 5. Verificar que fue eliminado
    const verifyResponse = await request.get(`${API_BASE}/teams/${teamId}`);
    expect(verifyResponse.status()).toBe(404);
  });

});
