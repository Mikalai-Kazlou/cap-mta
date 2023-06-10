const cds = require('@sap/cds');
const hdbext = require('@sap/hdbext');
const dbClass = require('sap-hdbext-promisfied');

module.exports = cds.service.impl(function () {
  const { Products } = this.entities()

  this.after('each', Products, row => {
    console.log(`Read Product: ${row.ID}`)
  })

  this.after(['CREATE', 'UPDATE', 'DELETE'], [Products], async (Product, req) => {
    const header = req.data
    req.on('succeeded', () => {
      global.it || console.log(`< emitting: product_Changed ${Product.ID}`)
      this.emit('prod_Change', header)
    })
  })

  this.on('GetSupplierInfo', async () => {
    try {
      const db = await cds.connect.to('db');

      const dbConnection = new dbClass(await dbClass.createConnection(db.options.credentials));
      const sp = await dbConnection.loadProcedurePromisified(hdbext, null, 'get_supplier_info');
      const output = await dbConnection.callProcedurePromisified(sp, []);

      console.log(output.results);
      return output.results;
    } catch (error) {
      console.error(error);
      return;
    }
  })
})