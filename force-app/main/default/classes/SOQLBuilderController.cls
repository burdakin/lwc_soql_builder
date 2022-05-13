public with sharing class SOQLBuilderController {

    @AuraEnabled (cacheable=true)
    public static List<String> getFieldsOfObject(String objectName) {
        List<String> result = new List<String>();
        Schema.SObjectType targetType = Schema.getGlobalDescribe().get(objectName);
        Map<String, Schema.SObjectField> fieldMap = targetType.getDescribe().fields.getMap();
            for (Schema.SObjectField field : fieldMap.values()) {
                 result.add(field.getDescribe().getName());
             }
        return result;
    }

    @AuraEnabled (cacheable=true)
    // will return List<sObjects>
    public static List<sObject> launchQuery (List<String> selectedFields, String objectName, String whereField, String whereData) {

        String fieldsToQuery = String.join(selectedFields, ', ');
        List<sObject> sobjList = new List<sObject>();
        if (whereData == null && whereField == null) {
            sobjList = Database.query('SELECT ' + fieldsToQuery + ' FROM ' + objectName);
        } else {
            sobjList = Database.query('SELECT ' + fieldsToQuery + ' FROM ' + objectName + ' WHERE ' + whereField + ' = ' + '\'' +  whereData + '\'');
        }
        return sobjList;
    }
    
    @AuraEnabled (cacheable=true)
    public static List<String> getAllObjects(){
        List<String> namesOfObject = new List<String>();
        List<ObjectPermissions> sObjts = [SELECT SObjectType FROM ObjectPermissions];
        for (ObjectPermissions sob : sObjts) {
            namesOfObject.add(sob.SobjectType);
        }
        return namesOfObject;
    }
}