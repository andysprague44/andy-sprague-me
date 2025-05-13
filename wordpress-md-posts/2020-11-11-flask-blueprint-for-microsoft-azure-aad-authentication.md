# Flask Blueprint for Microsoft Azure AAD Authentication
_Date: 2020-11-11 00:29:34_

This blog post takes you through adding authentication to a Flask application, using a blueprint, connecting to Microsoft Azure AAD using [MSAL Python library](https://pypi.org/project/msal/).

The hope is, you can *grab the blueprint, and drop it in* to your flask application, authentication done bish-bash-bosh, and then spend your time doing the more interesting stuff. **You won't have to code up *any* authentication endpoints!**

As always, go to the "I just want the code" section if you want to simply drop the blueprint into your app as quickly as possible without the detail.

* **Part 1** of this blog will go through how to use the blueprint in your own flask app.
* **Part 2** will talk a bit about what is going on under the covers of the blueprint code.
* **Part 3** is a 'bonus feature' of this application: As I was originally trying to figure out how to authenticate a [plotly dash](http://dash.plotly.com) web app with AAD, I will show you how to do this with the same blueprint.

A future improvement might be to add this to [flask-login](https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-v-user-logins), but, I didn't. \*shrug\*

### Prerequisites

* You have a Microsoft Azure account, or you can [create a free one.](https://azure.microsoft.com/en-gb/free/)
* You have the necessary permissions to create an app registration in the account
  + true if using the free account, or if you own your account
  + true if you own or can create a new/test 'azure active directory' within the account
  + not always true if you work for an organization with a DevOps / InfoSec function - but in this case you can ask them to add on your behalf
* You have heard of Flask
* Have install of python 3.x

## I just want the code

Complete example project: <https://github.com/andysprague44/flask.aad/> 

Authentication blueprint you can lift and drop into to your existing flask app: <https://github.com/andysprague44/flask.aad/tree/master/blueprints/auth>

# Part 1: How to use the flask authentication blueprint

Given an existing Flask app, how can we secure it?

## 1a. Add an Azure App Registration

For the Flask App to accept authentication requests from it's users it needs to be 'trusted' in the AAD domain. This is achieved by creating an 'App Registration', which represents the application in Azure-AAD-land.

1. Navigate to 'Azure Active Directory' in the left hand menu, then App registrations. Click 'New registration'

![NewAppRegistration_AzurePortal](https://andysprague.com/wp-content/uploads/2020/11/newappregistration_azureportal.png)

2. Create the App Registration. Give it a useful name, choose the account types according to your needs, and add an initial redirect URL:

* http://localhost:5000/auth/signin-oidc

![RegisterAnApplication_AzurePortal](https://andysprague.com/wp-content/uploads/2020/11/registeranapplication_azureportal-1.png)

3. Add 'App Roles' (for more info, see https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-add-app-roles-in-azure-ad-apps). Go to 'Manifest' tab in your app registration, and replace the line

> "appRoles": [],

with the following (change 'DemoApp' to the name you chose for the app reg in step 2):

```
"appRoles": [
 {
 "allowedMemberTypes": ["User"],
 "description": "Read Access",
 "displayName": "DemoApp Read",
 "id": "a8161423-2e8e-46c4-9997-f984faccb625",
 "isEnabled": true,
 "value": "DemoApp.Read"
 },
 {
 "allowedMemberTypes": ["User"],
 "description": "Write Access",
 "displayName": "DemoApp Write",
 "id": "b8161423-2e8e-46c4-9997-f984faccb625",
 "isEnabled": true,
 "value": "DemoApp.Write"
 },
 {
 "allowedMemberTypes": ["User"],
 "description": "Admin Access",
 "displayName": "DemoApp Admin",
 "id": "f2ec0750-6aee-4640-8f44-e050b8e35326",
 "isEnabled": true,
 "value": "DemoApp.Admin"
 }
 ],
```

4. Give your user the required app role(s), see https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-add-app-roles-in-azure-ad-apps.

* Note that, in the blueprint, if a user has Admin they are assumed to have Write & Read, and if the user has Write they are assumed to have Read.

## 1b. Adding the blueprint

My project assumes you are using the *[Flask Application Factory Pattern](https://hackersandslackers.com/flask-application-factory/)*, if you are not, well, you should be, so change your project structure then come back to this tutorial. If you can't be bothered, then fine (I guess), but you are somewhat on your own in hooking up this blueprint!

Good to carry on? OK then...

First, drop in the entire 'auth' blueprint folder into your app. I've assumed this is added to the path "`blueprints/auth`" relative to the project root.

Then, add the following to your requirements.txt file:

```
msal==1.6.0
flask-session==0.3.2
```

Then, register the blueprint in your app.py file, and use the decorator function `login_required` to secure your flask routes:

```
from flask import Flask
from werkzeug.middleware.proxy_fix import ProxyFix
from flask_session import Session
from . import appsettings as config
from blueprints.auth.decorators import login_required

def create_app():
    """Construct core Flask application with embedded Dash app."""
    app = Flask(__name__)
    app.config.from_object('application.appsettings.FlaskConfig')
    Session(app)
    
    with app.app_context():
        # Register Flask routes
        @app.route("/")
        @login_required #**This decorator authenticates the flask route**
        def index():
            return render_template('index.html', user=session["user"], version=msal.__version__)
        
        # Register blueprint for auth
        from blueprints import auth
        app.register_blueprint(
            auth.construct_blueprint(config.AuthenticationConfig),
            url_prefix='/auth')

        # Fix "flask.url_for" when deployed to an azure container web app
        # See https://github.com/Azure-Samples/ms-identity-python-webapp/issues/18#issuecomment-604744997
        app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)
    
    return app
```

Note that the example project splits out the flask routes to a routes.py file, but the approach is the same.

When registering the blueprint, you'll note the object `config.AuthenticationConfig` being passed in. This is a dict with the following keys, to add to a appsettings.py file (or perhaps a config.py in your own flask app):

```
# Config required by the authentication flask blueprint
AuthenticationConfig = {
    "TENANT": tenant,
    "CLIENT_ID": client_id,
    "CLIENT_SECRET": client_secret,
    "HTTPS_SCHEME": https_scheme
}
```

* **tenant**: from your App Registration overview page this is the guid which at the time of writing is called "Directory (tenant) ID"
* **client\_id**: from your App Registration overview page this is the guid which at the time of writing is called "Application (client) ID"
* **client\_secret**: from your App Registration, go to 'Certificates & secrets' page, and add a new client secret. Copy the value. Do not check this one into source control!
* **https\_scheme**: this is either 'http' or 'https'. While running locally this can be 'http' but should always be 'https' when deployed to production.

**\*Important**\*: Your flask session needs to use server-side sessions, to avoid the error "The "b'session'" cookie is too large". Add `SESSION_TYPE = 'filesystem'` to your flask app configuration:

```
app.config.update(SESSION_TYPE = 'filesystem')
```

## 1c. Configuring your application

My approach to configuration is pretty 'dotnet'-like (with appsettings.json files), so you may prefer something like [python-dotenv](https://pypi.org/project/python-dotenv/); fine by me. However, if you are using the demo application, including it's configuration approach (rather than grabbing the blueprint alone) you'll need to do the following:

1. Copy file appsettings.json and rename the copy to appsettings.Development.json
2. Leave appsettings.json alone (do not add your secrets here!)
3. Add your application config, including secrets, to appsettings.Development.json, noting that this file is ignored by git
4. If you add/remove keys, make sure to also update appsettings.py where the settings are materialized.

You can then configure the application authentication blueprint differently per environment, by having different application registration entries and adding the config to an env specific appsettings.{env}.json file.

If you are using your own configuration approach, you will need to construct the dict somewhere, and pass it into the blueprint.

```
# Config required by the authentication flask blueprint
AuthenticationConfig = {
    "TENANT": tenant,
    "CLIENT_ID": client_id,
    "CLIENT_SECRET": client_secret,
    "HTTPS_SCHEME": https_scheme
}
```

## 1d. Wrap up

With any luck, you should now be able to run your application locally, and have your flask app up and running with Azure AAD without coding up *any* authentication endpoints yourself!

# Part 2: What is the blueprint doing?

The 'auth' blueprint uses the python MSAL library to mediate authentication.

1. The python web application uses the Microsoft Authentication Library (MSAL) to obtain a JWT access token from the Microsoft identity platform (formerly Azure AD v2.0):
2. The token contains the app roles of the authenticated user; accordingly, the blueprint code checks that the uses has at a minimum 'Read' access to the application, or authentications fails.
3. The access token is saved into the flask session, for use later as a bearer token to authenticate the user in requests (e.g. calling the Microsoft Graph).

[![Overview](https://github.com/Azure-Samples/ms-identity-python-webapp/raw/master/ReadmeFiles/topology.png)](https://github.com/Azure-Samples/ms-identity-python-webapp/blob/master/ReadmeFiles/topology.png)

More details around the workflow can be found in the MSAL documentation, start here: <https://github.com/Azure-Samples/ms-identity-python-webapp>

# Part 3: Applying this to a plotly dash application

Dash is a library for creating responsive web apps written declaratively in python (no javascript required!).

Dash is powered by flask, so we are able to apply this same approach to securing dash applications. I followed the excellent walk-through at <https://hackersandslackers.com/plotly-dash-with-flask/> for the initial "add flask to dash" approach.

The trick is to start up Dash with a *flask server that we control.* To do this, we can add the dash app initialization as a step in the flask 'create\_app' method (again, this assumes flask application factory pattern is utilized, in this case it's probably mandatory).

Your 'create\_app' method can add these 2 lines, right after the flask routes and the authentication blueprint are registered:

```
# Register an embedded dash app
from .dashapp import create_dashapp
app = create_dashapp(app)
```

Then add the file 'dashapp.py' containing a factory method 'create\_dashapp' that takes the flask app as a parameter (called server' to avoid confusion with the dash 'app'). Now, we can start the dash app up, using our existing flask app!

```
def create_dashapp(server):
    """
    Init our dashapp, to be embedded into flask
    """
    app = dash.Dash(
        __name__,
        server=server,
        url_base_pathname='/dash/')
    app.config['suppress_callback_exceptions'] = True
    app.title = 'My Dash App'
    
    #... add dash callbacks & layout code here
    
    # End of create_dashapp method, return the flask app aka server (not the dash app)
    return app.server
```

The last step is how we fold in the authentication piece. We can protect the dash views, so that if a user navigates directly to '/dash' will be redirected to authenticate as we expect. Add the following method to dashapp.py:

```
from blueprints.auth.decorators import login_required
def protect_dashviews(dash_app):
    for view_func in dash_app.server.view_functions:
        if view_func.startswith(dash_app.config.url_base_pathname):
            dash_app.server.view_functions[view_func] = login_required(dash_app.server.view_functions[view_func])
```

And add an additional line to the 'create\_dashapp' factory method:

```
def create_dashapp(server):
    """
    Init our dashapp, to be embedded into flask
    """
    app = dash.Dash(
        __name__,
        server=server,
        url_base_pathname='/dash/')
    app.config['suppress_callback_exceptions'] = True
    app.title = 'My Dash App'
    protect_dashviews(app) #***We just added this line***
```

**Your dash app is now authenticated!**

One last thing to note in the dash app, is that I found it quite tricky to get the name of the authenticated user *inside* of the dash app components, especially immediately after the user authenticates. To achieve this, add the following component to the dash app layout:

```
dcc.Location(id='url', refresh=False), # represents the URL bar, doesn't render anything
```

Then add a callback to grab the name, which is fired when the redirection from the authentication workflow takes the user back to the dash app:

```
# Add callback for writing name of user to navbar
    @app.callback(Output('navbar-navigation', 'label'),
                  Input('url', 'pathname'))
    def user_name_to_navbar(pathname):
        if 'user' in flask.session:
            user = flask.session['user'].get('name', 'unknown')
        else:
            user = 'unknown'
        return user
```

Obviously, the above relies on the existence of the element 'navbar-navigation', so change the output to wherever you need to write the username to.

## Summary

I hope you found this useful. Chat in the comments with your suggestions on how to make this better, or raise a Pull Request.

Happy flask'ing!