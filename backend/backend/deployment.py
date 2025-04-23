import os
from .settings import *
from .settings import BASE_DIR

ALLOWED_HOSTS = ['educationorder-bke8f7exgybnbdg6.centralus-01.azurewebsites.net']
CSRF_TRUSTED_ORIGINS = ['https://educationorder-bke8f7exgybnbdg6.centralus-01.azurewebsites.net']
DEBUG = False
# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ['myEducationOrderSecretKey']

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

CONNECTION = os.environ['AZURE_POSTGRESQL_CONNECTIONSTRING']
CONNECTION_STR = {pair.split('=')[0]:pair.split('=')[1] for pair in CONNECTION.split(' ')}

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": CONNECTION_STR["dbname"],
        "HOST": CONNECTION_STR["host"],
        "USER": CONNECTION_STR["user"],
        "PASSWORD": CONNECTION_STR["password"],
    }
}

STATIC_ROOT = BASE_DIR/'staticfiles'