import std.conv;
import std.digest;
import std.digest.sha;
import std.stdio;

import vibe.d;
import vibe.web.auth;

import dauth;
import vibe.data.json;

import db_conn;

static struct AuthInfo
{
@safe:
    string userEmail;
}

@path("api/v1")
@requiresAuth
interface VirusTotalAPIRoot
{
    // Users management
    @noAuth
    @method(HTTPMethod.POST)
    @path("signup")
    Json addUser(string userEmail, string username, string password, string name = "", string desc = "");

    @noAuth
    @method(HTTPMethod.POST)
    @path("login")
    Json authUser(string userEmail, string password);

    @anyAuth
    @method(HTTPMethod.POST)
    @path("delete_user")
    Json deleteUser(string userEmail);

    // URLs management
    @anyAuth
    @method(HTTPMethod.POST)
    @path("add_url") // the path could also be "/url/add", thus defining the url "namespace" in the URL
    Json addUrl(string userEmail, string urlAddress);

    @noAuth
    @method(HTTPMethod.GET)
    @path("url_info")
    Json getUrlInfo(string urlAddress);

    @noAuth
    @method(HTTPMethod.GET)
    @path ("user_urls")
    Json getUserUrls(string userEmail);

    @anyAuth
    @method(HTTPMethod.POST)
    @path("delete_url")
    Json deleteUrl(string userEmail, string urlAddress);

    // Files management
    @anyAuth
    @method(HTTPMethod.POST)
    @path("add_file")
    Json addFile(string userEmail, immutable ubyte[] binData, string fileName);

    @noAuth
    @method(HTTPMethod.GET)
    @path("file_info")
    Json getFileInfo(string fileSHA512Digest);

    @noAuth
    @method(HTTPMethod.GET)
    @path("user_files")
    Json getUserFiles(string userEmail);

    @anyAuth
    @method(HTTPMethod.POST)
    @path("delete_file")
    Json deleteFile(string userEmail, string fileSHA512Digest);
}

class VirusTotalAPI : VirusTotalAPIRoot
{
    this(DBConnection dbClient)
    {
        this.dbClient = dbClient;
    }

    @noRoute AuthInfo authenticate(scope HTTPServerRequest req, scope HTTPServerResponse res)
    {
        // If "userEmail" is not present, an error 500 (ISE) will be returned
        string userEmail = req.json["userEmail"].get!string;
        string userAccessToken = dbClient.getUserAccessToken(userEmail);
        // Use headers.get to check if key exists
        string headerAccessToken = req.headers.get("AccessToken");
        if (headerAccessToken && headerAccessToken == userAccessToken)
            return AuthInfo(userEmail);
        throw new HTTPStatusException(HTTPStatus.unauthorized);
    }

override:

    Json addUser(string userEmail, string username, string password, string name = "", string desc = "")
    {

        if (password == null)
            throw new HTTPStatusException(HTTPStatus.badRequest, "[Bad Request] password is mandatory");
        

        auto response = dbClient.addUser(userEmail, username, password, name, desc);

        switch (response) {
            case dbClient.UserRet.OK:
                throw new HTTPStatusException(HTTPStatus.OK, "[OK] user is created");
            case dbClient.UserRet.ERR_INVALID_EMAIL:
                throw new HTTPStatusException(HTTPStatus.badRequest, "[Bad Request] email is invalid");
            case dbClient.UserRet.ERR_USER_EXISTS:
                throw new HTTPStatusException(HTTPStatus.unauthorized, "[Unathorized] user is was created");
            default:
                throw new HTTPStatusException(HTTPStatus.internalServerError, 
                "[Internal Server Error] user action not defined");
        }
    }

    Json authUser(string userEmail, string password)
    {
        auto response = dbClient.authUser(userEmail, password.dup);

        switch (response) {
            case dbClient.UserRet.OK:
                auto accessToken = dbClient.generateUserAccessToken(userEmail);
                auto j = Json(["AccessToken": Json(accessToken)]);
                return j;
            case dbClient.UserRet.ERR_NULL_PASS:
                throw new HTTPStatusException(HTTPStatus.badRequest, "[Bad Request] password is mandatory");
            case dbClient.UserRet.ERR_INVALID_EMAIL:
                throw new HTTPStatusException(HTTPStatus.badRequest, "[Bad Request] email is invalid");
            case dbClient.UserRet.ERR_WRONG_PASS:
            case dbClient.UserRet.ERR_WRONG_USER:
                throw new HTTPStatusException(HTTPStatus.unauthorized, "[Unathorized] wrong email/password");
            default:
                throw new HTTPStatusException(HTTPStatus.internalServerError, 
                "[Internal Server Error] user action not defined");
        }
    }

    Json deleteUser(string userEmail)
    {
        auto response = dbClient.deleteUser(userEmail);

        switch (response) {
            case dbClient.UserRet.OK:
                throw new HTTPStatusException(HTTPStatus.OK, "[OK] user is created");
            case dbClient.UserRet.ERR_INVALID_EMAIL:
                throw new HTTPStatusException(HTTPStatus.badRequest, "[Bad Request] email is invalid");
            default:
                throw new HTTPStatusException(HTTPStatus.internalServerError, 
                "[Internal Server Error] user action not defined");
        }
    }

    // URLs management

    Json addUrl(string userEmail, string urlAddress)
    {
        auto response = dbClient.addUrl(userEmail, urlAddress);

        switch (response) {
            case dbClient.UrlRet.OK:
            case dbClient.UrlRet.URL_EXISTS:
                throw new HTTPStatusException(HTTPStatus.OK, "[OK] success");
            case dbClient.UrlRet.ERR_EMPTY_URL:
                throw new HTTPStatusException(HTTPStatus.badRequest, "[BadRequest] empty url");
            default:
                throw new HTTPStatusException(HTTPStatus.internalServerError, 
                "[Internal Server Error] user action not defined");
        }
    }

    Json deleteUrl(string userEmail, string urlAddress)
    {

        if(urlAddress == null) {
            throw new HTTPStatusException(HTTPStatus.badRequest, "[BadRequest] empty url");
        }

        dbClient.deleteUrl(userEmail, urlAddress);
        throw new HTTPStatusException(HTTPStatus.OK, "[OK] success");
    }

    Json getUrlInfo(string urlAddress)
    {
        auto response = dbClient.getUrl(urlAddress);

        if (response.isNull()) {
            throw new HTTPStatusException(HTTPStatus.notFound, "[NotFound] not found");
        }


        return serializeToJson(response);
    }

    Json getUserUrls(string userEmail)
    {
        auto response = dbClient.getUrls(userEmail);

        return serializeToJson(response);
    }

    // Files management

    Json addFile(string userEmail, immutable ubyte[] binData, string fileName)
    {
        auto response = dbClient.addFile(userEmail, binData, fileName);

        switch (response) {
            case dbClient.FileRet.OK:
            case dbClient.FileRet.FILE_EXISTS:
                throw new HTTPStatusException(HTTPStatus.OK, "[OK] success");
            case dbClient.FileRet.ERR_EMPTY_FILE:
                throw new HTTPStatusException(HTTPStatus.badRequest, "[BadRequest] empty file");
            default:
                throw new HTTPStatusException(HTTPStatus.internalServerError, 
                "[Internal Server Error] user action not defined");
        }
    }

    Json getFileInfo(string fileSHA512Digest)
    {
        // TODO
        throw new HTTPStatusException(HTTPStatus.internalServerError, "[Internal Server Error] user action not defined");
    }

    Json getUserFiles(string userEmail)
    {
        // TODO
        throw new HTTPStatusException(HTTPStatus.internalServerError, "[Internal Server Error] user action not defined");
    }

    Json deleteFile(string userEmail, string fileSHA512Digest)
    {
        // TODO
        throw new HTTPStatusException(HTTPStatus.internalServerError, "[Internal Server Error] user action not defined");
    }

private:
    DBConnection dbClient;
}
