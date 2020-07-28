/* import Realm from 'realm';

class Inputfile extends Realm.Object {}
Inputfile.schema = {
    name: 'Inputfile',
    primaryKey: 'id',
    properties: {
        id: 'int',
        name:  'string',
        outputtype: 'string',
        outputformat: 'string',
        transfertype: 'string',
        createddate: 'date'
    }
  };

class Csvdata extends Realm.Object {}
Csvdata.schema = {
    name: 'Csvdata',
    primaryKey: 'id',
    properties: {
      id: 'int',
      rowdata:  'data?'
    }
  };
  export default new Realm({schema: [Inputfile, Csvdata]}); */