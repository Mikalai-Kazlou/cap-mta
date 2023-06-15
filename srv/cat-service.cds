using hc450.officesupplies as officesupplies from '../db/schema';

service CatalogService {
  @odata.draft.enabled: true
  entity Products @(restrict: [
    {
      grant: ['READ'],
      to   : ['Vendor'],
    //where: 'supplier = $user'
    },
    {
      grant: ['*'],
      to   : ['ProcurementManager']
    }
  ]) as projection on officesupplies.Products;

  entity Suppliers @(restrict: [
    {
      grant: ['READ'],
      to   : ['Vendor']
    },
    {
      grant: ['*'],
      to   : ['ProcurementManager']
    }
  ]) as projection on officesupplies.Suppliers;

  function GetSupplierInfo() returns array of Suppliers;
};
