## Objetivo

Mostrar que, si no frenás el contagio a tiempo, las acciones después son muy
tardías; en particular por el tiempo que tarda en ser sintomático.

## Reglas

### Personas

Las personas tienen 5 estados posibles:

* Sano
* Contagiado sin síntomas
* Contagiado pre-síntomas
* Contagiado con síntomas
* Recuperado
* Muerto

El estado cambia de un día al siguiente. Las transiciones son:

* Sano -> Sano (si no tuvo contacto con ningún contagiado)
* Sano -> Contagiado sin síntomas 
    (p = 0.1, si estuvo en contacto con un contagiado pre-síntomas en espacio laboral)
* Sano -> Contagiado sin síntomas 
    (p = 0.5, si estuvo en contacto con un contagiado pre-síntomas en una reunión)
* Contagiado sin síntomas -> Contagiado pre-síntomas
    (p = 1 a los 5 días de haber pasado a contagiado sin síntomas)
* Contagiado pre-síntomas -> Contagiado con síntomas
    (p = 1 a los 2 días de haber pasado a contagiado sin síntomas)
* Contagiado con-síntomas -> Recuperado
    (p = 0.93 a los 9 síntomas de haber empezado con síntomas)
* Contagiado con-síntomas -> Muerto 
    (p = 0.03 a los 9 síntomas de haber empezado con síntomas)


Además las personas tienen un grado de felicidad. El mismo empieza en 100 y
puede cambiar cada día:

* +2 si se reune con un amigo
* 0 si va a trabajar
* -1 si no va a trabajar ni se reune con un amigo


### Población

El pueblo tiene 1000 habitantes y se empieza con 1 persona contagiada
pre-síntomas.

El pueblo tiene T lugares de trabajo distintos donde se distribuyen todas las
personas. 

### Variables controlables

* % de la población habilitada a trabajar
* Cantidad de personas que se pueden reunir

### Dinámica

1. Empieza el día. Reporte diario de:
    * Infectados con síntomas 
    * Muertos
   El jugador define los valores controlables de ese día.
2. La población habilitada a trabajar va a trabajar. 
3. Se producen las reuniones.
4. Se hacen las transiciones de personas y se actualizan los valores de
   felicidad.

### Trabajos

Predefinidamente, las personas están distribuídas en los T lugares de trabajo y
además tienen un ranking de "esenciales". Solo están habilitados para trabajar
quienes no tengan síntomas ni estén muertos. Van a sus lugares de trabajo el
porcentaje establecido de los habilitados a trabajar en orden de esenciales.

### Reuniones

`TODO`
