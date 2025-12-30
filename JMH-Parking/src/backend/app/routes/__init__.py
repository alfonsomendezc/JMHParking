#from .health import bp as health_bp
#from .parkers import bp as parkers_bp
from .forms import forms_bp

def register_routes(app):
    #app.register_blueprint(health_bp)
   # app.register_blueprint(parkers_bp)
    app.register_blueprint(forms_bp)