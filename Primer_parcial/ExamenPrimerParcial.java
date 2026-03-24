import java.util.Scanner;

public class ExamenPrimerParcial  {

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int opcion;

        do {
            System.out.println("\n--- SISTEMA DE COTIZACIÓN DE PISOS ---");
            System.out.println("1. Realizar nueva cotización");
            System.out.println("2. Salir");
            System.out.print("Seleccione una opción: ");
            opcion = sc.nextInt();
            sc.nextLine(); // Limpiar el buffer

            if (opcion == 1) {
                System.out.print("Ingrese el nombre completo del comprador: ");
                String nombre = sc.nextLine();

                System.out.print("Ingrese el ancho del piso (metros): ");
                double ancho = sc.nextDouble();

                System.out.print("Ingrese el largo del piso (metros): ");
                double largo = sc.nextDouble();

                double area = ancho * largo;

                System.out.println("\nTipos de piso disponibles:");
                System.out.println("a) Laminado Porcelanato ($13.45/m²)");
                System.out.println("b) Marmolado ($43.95/m²)");
                System.out.println("c) Acrílico ($39.24/m²)");
                System.out.print("Seleccione la opción (a, b o c): ");
                char tipoPiso = sc.next().toLowerCase().charAt(0);

                double precioMetro = 0;

                switch (tipoPiso) {
                    case 'a': precioMetro = 13.45; break;
                    case 'b': precioMetro = 43.95; break;
                    case 'c': precioMetro = 39.24; break;
                    default:
                        System.out.println("Opción de piso no válida.");
                        continue;
                }

                // Cálculos
                double costoBase = area * precioMetro;
                double descuento = costoBase * 0.0725; // 7.25%
                double subtotalConDescuento = costoBase - descuento;
                
                // Impuesto (considerando el 16% de IVA estándar)
                double impuesto = subtotalConDescuento * 0.16;
                double costoTotal = subtotalConDescuento + impuesto;

                // Salida de resultados
                System.out.println("\n========================================");
                System.out.println("RESUMEN DE VENTA");
                System.out.println("Comprador: " + nombre);
                System.out.printf("Área a cubrir: %.2f m2\n", area);
                System.out.printf("Costo inicial: $%.2f\n", costoBase);
                System.out.printf("Descuento aplicado (7.25%%): -$%.2f\n", descuento);
                System.out.printf("Impuestos (IVA): $%.2f\n", impuesto);
                System.out.println("----------------------------------------");
                System.out.printf("COSTO TOTAL FINAL: $%.2f\n", costoTotal);
                System.out.println("========================================\n");

            } else if (opcion != 2) {
                System.out.println("Opción no válida, intente de nuevo.");
            }

        } while (opcion != 2);

        System.out.println("Programa finalizado. ¡Gracias!");
        sc.close();
    }
}