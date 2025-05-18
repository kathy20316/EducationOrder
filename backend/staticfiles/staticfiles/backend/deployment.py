import os
import ssl
from .settings import *
from .settings import BASE_DIR

ALLOWED_HOSTS = ['educationorder-bke8f7exgybnbdg6.centralus-01.azurewebsites.net']
CSRF_TRUSTED_ORIGINS = ['https://educationorder-bke8f7exgybnbdg6.centralus-01.azurewebsites.net']
DEBUG = False
# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ['MY_SECRET_KEY']

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'debug_toolbar.middleware.DebugToolbarMiddleware',
]

# CORS_ALLOW_ORIGINS = [
#     'https://educationorder-bke8f7exgybnbdg6.centralus-01.azurewebsites.net',
#     'http://localhost:3000',
#     'https://kathy20316.github.io/EducationOrder/index.html',
# ]

STORAGES = {
    "default": {
        "BACKEND": "storages.backends.azure_storage.AzureStorage",
        # "OPTIONS": {
        #     "token_credential": DefaultAzureCredential(),
        #     "account_name": "mystorageaccountname",
        #     "azure_container": "media",
        # },
    },
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedStaticFilesStorage",
        # "OPTIONS": {
        #     "token_credential": DefaultAzureCredential(),
        #     "account_name": "mystorageaccountname",
        #     "azure_container": "static",
        # },
    },
}

DATABASES = {
    "default": {
        'ENGINE': 'django.db.backends.mysql',  # Use 'mysql' engine
        'NAME': 'AZURE_MYSQL_NAME',  # Replace with your actual database name
        'USER': 'AZURE_MYSQL_USER',  # Replace with your database username
        'PASSWORD': 'AZURE_MYSQL_PASSWORD',  # Replace with your database password
        "HOST": 'AZURE_MYSQL_HOST',
        # "PORT": '3306',
        # "OPTIONS": {
        #     "ssl": {
        #         "ca": os.path.join(BASE_DIR, "BaltimoreCyberTrustRoot.crt.pem"),
        #         "cert_reqs": ssl.CERT_REQUIRED,
        #     }
        # },
    }
}

STATIC_ROOT = BASE_DIR/'staticfiles'