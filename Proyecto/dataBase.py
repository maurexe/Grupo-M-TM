import pymysql
from tkinter import messagebox
class DataBase():
    def __init__(self):
        self.coneccion=pymysql.connect(
            host="localhost",
            user="root",
            password="",
            db="Cuentas"
        )
        self.cursor=self.coneccion.cursor()
        #messagebox.showinfo("BBDD","conexion establecida con exito")
    def insertarConductor(self, id, nombre, apellido, password, edad, provincia, localidad, domilicilio, genero, foto):
        try:
            self.cursor.execute("INSERT INTO cuentasconductor values ('"+ id +
            "','"+ nombre+
            "','"+ apellido+
            "','"+ password+
            "','"+ str(edad) +
            "','"+ provincia+
            "','"+ localidad+
            "','"+ domilicilio+
            "','"+ genero+
            "','"+ foto+"')")
            self.coneccion.commit()
            messagebox.showinfo("BBDD", "Cuenta creada con exito")
        except:
            messagebox.showwarning("ATENCION!", "¡esta CUENTA ya se encuentra registrada!")
    def insertarComercio(self, id, dni, nombre, password, provincia, localidad, domilicilio,foto ):
        try:
            self.cursor.execute("INSERT INTO cuentascomercio values ('"+ id +
            "','"+ str(dni)+
            "','"+ nombre+
            "','"+ password+
            "','"+ provincia+
            "','"+ localidad+
            "','"+ domilicilio+
            "','"+ foto+"')")
            self.coneccion.commit()
            messagebox.showinfo("BBDD", "Cuenta creada con exito")
        except:
            messagebox.showwarning("ATENCION!", "¡esta CUENTA ya se encuentra registrada!")
    def verificar_user(self, cuentas, id, password):
        if cuentas=="comercio":
            sql="select id, password from cuentascomercio where id='{}' and password='{}'".format(id, password)
            self.cursor.execute(sql)
            user=self.cursor.fetchone()
            largo=len(user)
        else:
            sql="select id, password from cuentasconductor where id='{}' and password='{}'".format(id, password)
            self.cursor.execute(sql)
            user=self.cursor.fetchone()
            largo=len(user)
