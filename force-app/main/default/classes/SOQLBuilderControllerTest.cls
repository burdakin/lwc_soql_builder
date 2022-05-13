@isTest
public with sharing class SOQLBuilderControllerTest {
    @isTest
    public static void getFieldsOfObjectTest() {
        String accObjectName = 'Account';

        Test.startTest();
        List<String> result = SOQLBuilderController.getFieldsOfObject(accObjectName);
        Test.stopTest();

        System.assertEquals(true, result.contains('Name'));
    }

    @isTest
    public static void getAllObjectsTest() {
        Test.startTest();
        List<String> result = SOQLBuilderController.getAllObjects();
        Test.stopTest();

        System.assertNotEquals(0, result.size());
    }

    @isTest
    public static void launchQueryTest() {
        Contact testContact = new Contact();
        testContact.LastName = 'Test';
        testContact.FirstName = 'Real';
        insert testContact;

        Test.startTest();
        List<String> fields = new List<String>();
        fields.add('LastName');
        List<SObject> resultLong = SOQLBuilderController.launchQuery(fields, 'Contact', 'LastName', 'Test');
        List<SObject> resultShort = SOQLBuilderController.launchQuery(fields, 'Contact', null, null);
        Test.StopTest();

        System.assertNotEquals(0, resultLong.size());
        System.assertNotEquals(0, resultShort.size());
        
    }
}
