import std.algorithm.searching;
import std.conv;
import std.digest;
import std.digest.sha;
import std.range;
import std.stdio;
import std.string;
import std.typecons;

import vibe.db.mongo.mongo : connectMongoDB, MongoClient, MongoCollection;
import vibe.data.bson;

import dauth : makeHash, toPassword, parseHash;

extern(C) ulong strlen (
  scope const(char*) s
) pure nothrow @nogc;


struct DBConnection
{

    MongoClient client;
    string dbName;

    enum UserRet
    {
        OK,
        ERR_NULL_PASS,
        ERR_USER_EXISTS,
        ERR_INVALID_EMAIL,
        ERR_WRONG_USER,
        ERR_WRONG_PASS,
        NOT_IMPLEMENTED
    }

    this(string dbUser, string dbPassword, string dbAddr, string dbPort, string dbName)
    {
        string connectionUrl = dbUser ~ ":" ~ dbPassword ~ "@" ~ dbAddr;
        client = connectMongoDB(connectionUrl);
        this.dbName = dbName;
    }
    
    bool verifyAdress(string email) {
        int ok = 0;
        if (email[0] < 'A' || email[0] > 'z')
            return false;

         for (int i = 1 ; i < strlen( cast(char*)email); i++ )
        {
            if(email[i] == '@')
                ok = 1;
            
            if(ok == 1 && ( email[i] >= 'A' && email[i] <= 'z'))
                ok = 2;
            
            if(ok == 2 && email[i] == '.')
                ok = 3;
            
            if(ok == 3 && ( email[i] > 'A' && email[i] < 'z'))
                ok = 4 ;

        }
        if (ok == 4)
            return true;
        else 
            return false;
    }

    UserRet addUser(string email, string username, string password, string name = "", string desc = "")
    {   
        if ( !verifyAdress(email))
            return UserRet.ERR_INVALID_EMAIL;

        if(password == null)
            return UserRet.ERR_NULL_PASS;

        MongoCollection users = client.getCollection(dbName ~ ".users");

        auto oneResult = users.findOne(["_id": email]);

        if (oneResult == Bson(null))
        {
            users.insert(["_id": email, "username": username, "password": password, "name": name, "description": desc]);
            return UserRet.OK;
        }
        return UserRet.ERR_USER_EXISTS;

    }

    UserRet authUser(string email, string password)
    {
        if ( !verifyAdress(email))
            return UserRet.ERR_INVALID_EMAIL;

        if(password == null)
            return UserRet.ERR_NULL_PASS;

        MongoCollection users = client.getCollection(dbName ~ ".users");
        auto oneResult = users.findOne(["_id": email, "password": password]);

        if (oneResult == Bson(null))
        {
            return UserRet.ERR_WRONG_PASS;
        }
        return UserRet.OK;
    }

    UserRet deleteUser(string email)
    {

        MongoCollection users = client.getCollection(dbName ~ ".users");
        users.remove(["_id": email]);

        auto oneResult = users.findOne(["_id": email]);

        if(oneResult == Bson(null))
            return UserRet.OK;
        
        return UserRet.NOT_IMPLEMENTED;
    }

    struct File
    {
        @name("_id") BsonObjectID id; // represented as _id in the db
        string userId;
        ubyte[] binData;
        string fileName;
        string digest;
        string securityLevel;
    }

    enum FileRet
    {
        OK,
        FILE_EXISTS,
        ERR_EMPTY_FILE,
        NOT_IMPLEMENTED
    }

    FileRet addFile(string userId, immutable ubyte[] binData, string fileName)
    {
        if (binData == null){
            return FileRet.ERR_EMPTY_FILE;
        }

        MongoCollection files = client.getCollection(dbName ~ ".files");

        auto dataDigest = digest!SHA512(binData).toHexString().to!string;

        auto oneResult = files.findOne(["binData": cast(char[])binData]);

        if (oneResult != Bson(null)) {
            return FileRet.FILE_EXISTS;
        }

        // PROBABLY TODO
        files.insert([
            "userId": userId,
            "binData": cast(char[])binData,
            "fileName": fileName,
            "digest":  dataDigest,
            "securityLevel": "2"]);
        
        return FileRet.OK;
    }

    File[] getFiles(string userId)
    {
        MongoCollection files = client.getCollection(dbName ~ ".files");

        auto result = files.find(["userId": userId]);
        // TODO
        // File[] fileResult;
        // foreach(r; result) {
        //     fileResult
        // }
        return [File()];
    }

    Nullable!File getFile(string digest)
    in(!digest.empty)
    do
    {
        MongoCollection files = client.getCollection(dbName ~ ".files");

        auto result = files.findOne(["digest": digest]);

        // TODO
        Nullable!File file;
        deserializeBson(file, result);
        return file;
    }

    void deleteFile(string digest)
    in(!digest.empty)
    do
    {
        MongoCollection files = client.getCollection(dbName ~ ".files");

        files.remove(["digest": digest]);
    }

    struct Url
    {
        @name("_id") BsonObjectID id; // represented as _id in the db
        string userId;
        string addr;
        string securityLevel;
        string[] aliases;
    }

    enum UrlRet
    {
        OK,
        URL_EXISTS,
        ERR_EMPTY_URL,
        NOT_IMPLEMENTED
    }

    UrlRet addUrl(string userId, string urlAddress)
    {

        if(urlAddress == null)
            return UrlRet.ERR_EMPTY_URL;

        
        MongoCollection urls = client.getCollection(dbName ~ ".urls");

        string[] aliases = ["alias1", "alies2", "alias3"];

        auto result = urls.findOne(["urlAddress": urlAddress]);

        // if(result != null)
        //     return UrlRet.URL_EXISTS;
        
        urls.insert(["userId": userId, "urlAddress": urlAddress, "securityLevel": "3", "aliases": cast(char[])aliases]);

        return UrlRet.OK;

    }

    Url[] getUrls(string userId)
    {
        // TODO
        return [Url()];
    }

    Nullable!Url getUrl(string urlAddress)
    in(!urlAddress.empty)
    do
    {
         MongoCollection urls = client.getCollection(dbName ~ ".urls");
        auto result = urls.findOne(["urlAddress": urlAddress]);
        // TODO
        Nullable!Url url;
        return url;
    }

    void deleteUrl(string urlAddress)
    in(!urlAddress.empty)
    do
    {
         MongoCollection urls = client.getCollection(dbName ~ ".urls");        
        urls.remove(["urlAddress": urlAddress]);
    }
}
