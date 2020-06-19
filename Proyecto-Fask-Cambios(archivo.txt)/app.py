from flask import Flask, render_template, request,redirect, url_for, flash
from flask_mysqldb import MySQL
import mysql.connector
app= Flask(__name__)
# coneccion-----------------------
#app.config["MYSQL_HOST"]="localhost"
#app.config["MYSQL_USER"]="root"
#app.config["MYSQL_PASSWORD"]=""
#app.config["MYSQL_DB"]="cuentas"
#mysql=MySQL(app)

db = mysql.connector.connect(
   host="localhost",
   user="root",
   passwd="",
   database='cuentas'
)
mysql = MySQL(app)

#-----------SESION-----------
app.secret_key="mysecretkey"
#---------------
@app.route("/")
def Index():
    return render_template("index.html")
@app.route("/cuenta", methods=["POST"])
def verificar():
    if request.method=="POST":
        usuario=request.form["usuario"]
        password=request.form["password"]
        if usuario.isalnum()==True and password.isalnum()==True:
            cursor=db.cursor()
            sql="select id, password from cuentasconductor where id='{}' and password='{}'".format(usuario, password)
            cursor.execute(sql)
            user=cursor.fetchone()
            if user != None:
                cursor=db.cursor()
                sql="select * from cuentasconductor where id='{}'".format(usuario)
                cursor.execute(sql)
                datos=cursor.fetchall()
                return render_template("index.html", id = usuario, datos=datos)
            else:#si devuelve vacio es porque no encontro cuenta de conductor y va a buscar en la tabla de cuentas de comercio
                cursor=db.cursor()
                sql="select id, password from cuentascomercio where id='{}' and password='{}'".format(usuario, password)
                cursor.execute(sql)
                user=cursor.fetchone()
                if user != None:
                    cursor=db.cursor()
                    sql="select * from cuentascomercio where id='{}'".format(usuario)
                    cursor.execute(sql)
                    datos=cursor.fetchall()
                    return render_template("cuenta.html", id = usuario, datos=datos)
                else:
                    flash("usuario y/o password incorrecto")
                    return redirect(url_for("Index"))
        else:
            flash("usuario y/o password incorrecto")
            return redirect(url_for("Index"))
@app.route("/agregarConductor", methods=["POST"])
def add_conductor():
    try:
        if request.method=="POST":
            usuario=request.form["usuario"]
            nombre=request.form["nombre"]
            password=request.form["password"]
            edad=request.form["edad"]
            provincia=request.form["provincia"]
            localidad=request.form["localidad"]
            domicilio=request.form["domicilio"]
            if int(edad) < 18:
                flash("ERES MENOR DE EDAD NO TE PUEDES REGISTRAR.")
                return redirect(url_for("Index"))
            else:
                cursor=db.cursor()
                cursor.execute("insert into cuentasconductor values (%s, %s, %s, %s, %s, %s, %s)",
                (usuario, nombre, password, edad, provincia, localidad, domicilio))
                db.commit()
                flash("CONDUCTOR AGREGADO SATISFACTORIAMENTE")
                db.close()
                return redirect(url_for("Index"))
    except:
        flash("AH OCURRIDO UN ERROR, INTENTE NUEVAMENTE.")
        return redirect(url_for("Index"))
@app.route("/agregarComercio", methods=["POST"])
def add_comercio():
    try:
        if request.method=="POST":
            usuario=request.form["usuario"]
            dni=request.form["dni"]
            nombre=request.form["nombre"]
            password=request.form["password"]
            provincia=request.form["provincia"]
            localidad=request.form["localidad"]
            domicilio=request.form["domicilio"]
            cursor=mysql.connection.cursor()
            cursor.execute("insert into cuentascomercio values (%s, %s, %s, %s, %s, %s, %s)",
            (usuario, dni, nombre, password, provincia, localidad, domicilio))
            db.commit()
            flash("COMERCIO AGREGADO SATISFACTORIAMENTE")
            db.close()
            return redirect(url_for("Index"))
    except:
        flash("AH OCURRIDO UN ERROR, INTENTE NUEVAMENTE.")
        return redirect(url_for("Index"))

if __name__ == "__main__":
    app.run(port = 3000, debug = True)
