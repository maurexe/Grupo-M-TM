print("Ingrese un numero de 4 digitos, el cual contenga 2 que sean diferentes")
print("es válido colocar el dígito 0 al principio, por lo que el número 0009 es válido")
#----variables contadoras del primer while y contador de vueltas del segundo while
contadorWhile=0
contadorVueltas=0
#variables las cuales mas adelante se ocupan para dar valor de string o enteros para poder utilizar la lista que se crea
primero=0
segundo=0
tercero=0
cuarto=0
#variable salida la cual una ves llegada a la Constante de Kaprekar finaliza el programa
salida=0
while contadorWhile==0:#en este while se verifica que sea exactamente un numero de 4 digitos
    valores=input("ingrese un numero de 4 digitos(recuerde al menos 2 diferentes): ")
    contadorFor=0#contador del for linea siguiente el cual da acceso a algunas acciones para asignar valores a las variables
    for a in valores:#con este for se verifica si el numero ingresado tiene todos los valores repetidos o no
        if contadorFor==3:
            cuarto=int(a)
            contadorFor+=1
            if int(primero) == int(segundo) and int(segundo) ==int(tercero) and int(tercero)==int(cuarto):#se verifica si los numeros son todos iguales
                salida=8
                print("salida= ",salida, "(8= todos los numeros son iguales)")
                print("fin del programa")
                salida=6174# esta variable se corta el programa ya que no entra al while de la linea 39 y finaliza el programa
        if contadorFor==2:
            tercero=int(a)
            contadorFor+=1
        if contadorFor==1:
            segundo=int(a)
            contadorFor+=1
        if contadorFor==0:
            primero=int(a)
            contadorFor+=1
    if len(valores)>3 and len(valores) <5:
        contadorWhile=1
    else:
        print()
        print("a ingresado mas de 4 digitos o menos de 3 digitos. Intente nuevamente")
        contadorWhile=0
while salida!=6174:# en este while se realiza toda la operacion para llegar a la Constante de Kaprekar
    numeros= list(map(int, valores))#se crea la lista con los valores ingresador
    numeros.sort()#se ordena la lista de menor a mayor
    ascendente=""
    print("ascendente",numeros)
    for a in range(4):#con este for se obtiene los valores de la lista ordenada y los paso primero a String y luego los almaceno en una variable
        if a==0:
            primero=str(numeros[a])
        if a==1:
            segundo=str(numeros[a])
        if a==2:
            tercero=str(numeros[a])
        if a==3:
            cuarto=str(numeros[a])
            ascendente=primero+segundo+tercero+cuarto#en esta variable se almacena los valores de la lista ordenada ascendente
    numeros.reverse()
    print("descendente", numeros)
    for a in range(4):
        if a==0:
            primero=str(numeros[a])
        if a==1:
            segundo=str(numeros[a])
        if a==2:
            tercero=str(numeros[a])
        if a==3:
            cuarto=str(numeros[a])
            descendente=primero+segundo+tercero+cuarto#en esta variable se almacena los valores de la lista ordenada descendente
    salida=int(descendente)-int(ascendente)#se pasa a entero los string y realizo la operacion para llegar a la Constante de Kaprekar (resto descendente - ascendente)
    valores=str(salida)# aca se pasa el resultado de la operacion anterior y lo almaceno en "valores" para que repita todo el while con otros valores
    print("salida =: ",salida)#con este print se muestra el resultado que me dio la operacion de restar
    contadorVueltas+=1# se cuenta las vueltas que da para llegar a la constante de Kaprekar
    if salida==6174:# con este if se muestra la cantidad de vueltas que dio para llegar a la constante de Kaprekar
        print("vueltas que dio para alcanzar la Constante de Kaprekar= ",contadorVueltas)
