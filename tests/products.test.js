const chai = require("chai");
const { expect } = chai;
const supertest = require('supertest');
const app = require('../src/server.js');
const request = supertest(app);

describe('Router de products', () => {
  it('Debería obtener la lista de productos', async () => {
    const response = await request.get('/products/api')
    expect(response.status).to.equal(200);
    expect(response.body.docs).to.be.an('array');
    expect(response.body.docs).to.have.length.above(0);  // Verificar que la lista no esté vacía
    expect(response.body.docs[0]).to.have.property('title');  // Verificar que los productos tienen un título
  });

  it('Debería crear dar error por código en uso y devolver un código 400', async () => {
    const nuevoProducto = {
      title: 'Nuevo Producto',
      description: 'Descripción del nuevo producto',
      price: 2500,
      stock: 15,
      category: "Abarrote",
      code: "NP01",
      status: true,
      owner: "admin"
    };

    const response = await request.post('/products/addProduct').send(nuevoProducto);
    expect(response.status).to.equal(400);
    expect(response.body.message).to.contain(`El código ${nuevoProducto.code} ya está siendo utilizado`);
    // Agrega más expectativas según la estructura de tu aplicación
  });

  it('Debería actualizar un producto existente y devolver un código 200', async () => {
    productId = "659867ef72460a646772eab9"
    const productoActualizado = {
      title: 'Producto Actualizado',
      description: 'Descripción actualizada del producto',
      price: 2600,
    };

    const response = await request.put(`/products/update/${productId}`).send(productoActualizado);

    expect(response.status).to.equal(200); // Código 200 indica éxito en la actualización
    expect(response.body).to.have.property('id', 1); // Verifica que el ID sea el mismo que el del producto actualizado
    expect(response.body.title).to.equal(productoActualizado.title);
    // Agrega más expectativas según la estructura de tu aplicación
  });
});
