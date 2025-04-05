import http from 'k6/http';
import { check, sleep, group } from 'k6';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

export default function () {

  group('GET - Obtener lista de publicaciones', () => {
    const res = http.get(`${BASE_URL}/posts`);
    check(res, {
      'estado es 200': (r) => r.status === 200,
      'tiempo de respuesta es bajo': (r) => r.timings.duration < 500,
    });
    sleep(1);
  });

  group('POST - Crear una nueva publicación', () => {
    const newPost = {
      title: 'Mi nueva publicación',
      body: 'Este es el contenido de la nueva publicación.',
      userId: 1,
    };
    const res = http.post(`${BASE_URL}/posts`, JSON.stringify(newPost), {
      headers: { 'Content-Type': 'application/json' },
    });
    check(res, {
      'estado es 201': (r) => r.status === 201,
      'respuesta contiene un id': (r) => JSON.parse(r.body).id !== undefined,
    });
    sleep(1);
  });

  group('PUT - Actualizar una publicación existente', () => {
    const updatedPost = {
      id: 1,
      title: 'Publicación actualizada',
      body: 'Contenido actualizado de la publicación.',
      userId: 1,
    };
    const res = http.put(`${BASE_URL}/posts/1`, JSON.stringify(updatedPost), {
      headers: { 'Content-Type': 'application/json' },
    });
    check(res, {
      'estado es 200': (r) => r.status === 200,
      'cuerpo contiene los datos actualizados': (r) => {
        const jsonResponse = JSON.parse(r.body);
        return jsonResponse.title === updatedPost.title && jsonResponse.body === updatedPost.body;
      },
    });
    sleep(1);
  });

  group('DELETE - Eliminar una publicación', () => {
    const res = http.del(`${BASE_URL}/posts/1`);
    check(res, {
      'estado es 200 o 204': (r) => r.status === 200 || r.status === 204,
    });
    sleep(1);
  });
}
