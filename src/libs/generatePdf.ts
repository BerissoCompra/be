export const crearHtmlCierreCaja = (totalIngresoDiario: any, cantidadPedidos: any, pedidosDelDia: any[]) =>{

    let pedidos = ``;
    const date = new Date();
    const dateActual = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()));
    const day = dateActual.getDate();
    const mes =  dateActual.getUTCMonth();
    const year =  dateActual.getFullYear();
    const dayString = dateActual.getDay();
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
    const fechaHoy = `${dias[dayString]} ${day}/${mes + 1}/${year}`;

    pedidosDelDia.map((pedido, index)=>{
        let hora = pedido.fecha.getHours() < 10 ? ('0'+pedido.fecha.getHours()): pedido.fecha.getHours();
        let min = pedido.fecha.getMinutes() < 10 ? ('0'+pedido.fecha.getMinutes()): pedido.fecha.getMinutes();
        const fecha = `${hora}:${min}`;
       
        pedidos += `
            <tr style="height: 1.563rem;">
                <td style="text-align: center; border: 0.063rem solid #000;">${index + 1}</td>
                <td style="text-align: center; border: 0.063rem solid #000;">${pedido.pedidoId}</td>
                <td style="text-align: center; border: 0.063rem solid #000;">${fecha}</td>
                <td style="text-align: center; border: 0.063rem solid #000;">x${pedido.items}</td>
                <td style="text-align: center; border: 0.063rem solid #000;">${formatter.format(pedido.total)}</td>
                <td style="text-align: center; border: 0.063rem solid #000;">${pedido.pagoEfectivo ? 'Efectivo' : 'Digital'}</td>
                <td style="text-align: center; border: 0.063rem solid #000;">${pedido.nombreCliente}</td>
            </tr>
        `
    })

    const content = `
    <div style="padding: 1.25rem; font-family: Arial, Helvetica, sans-serif;">
        <h1 style="text-align: center;">Cierre ${fechaHoy}</h1>
        <table style="width: 90%; border: 0.063rem solid #000; border-collapse: collapse; margin: 0 auto;">
        <tr>
            <th style="border: 0.063rem solid #000;">#</th>
            <th style="border: 0.063rem solid #000;">Pedido #Id</th>
            <th style="border: 0.063rem solid #000;">Horario</th>
            <th style="border: 0.063rem solid #000;">Items</th>
            <th style="border: 0.063rem solid #000;">Total</th> 
            <th style="border: 0.063rem solid #000;">Tipo pago</th>
            <th style="border: 0.063rem solid #000;">Cliente</th>      
        </tr>
            ${pedidos}
        </table>
        <footer style="position: absolute; bottom: 2rem;">
            <p style="font-size: 1.25rem; text-align: center; padding: 0; margin: 0;">Total Ingresos: ${formatter.format(totalIngresoDiario)}</p>
            <p style="font-size: 0.75rem; padding: 0; margin: 0; color: #9E9E9E;">${year} &copy Ciudad - App</p>
        </footer>
    </div>
    `;

    return content;
}

export const crearHtmlPedido = (pedido: any): string=>{

    let productos = ``;
    const date = new Date();
    const year =date.getFullYear();
    pedido.productos.map((producto: any)=>{
        productos+=
        `
        <tr style="height: 1.563rem;">
            <td style="text-align: center; border: 0.063rem solid #000; font-size: 0.75rem;">${producto.producto.nombre}</td>
            <td style="text-align: center; border: 0.063rem solid #000; font-size: 0.75rem;">x${producto.cantidad}</td>
            <td style="text-align: center; border: 0.063rem solid #000; font-size: 0.75rem;">${formatter.format(producto.precioTotal)}</td>
        </tr>
        `
    })

    const content = `
    <div style="padding: 1.25rem; font-family: Arial, Helvetica, sans-serif;">
        <h1 style="text-align: center; font-size: 1.25rem;"># ${pedido.idPedido}</h1>
        <table style="width: 100%; border: 0.063rem solid #000; border-collapse: collapse; margin: 0 auto;">
        <tr>
            <th style="border: 0.063rem solid #000; font-size: 0.75rem;">Producto</th>
            <th style="border: 0.063rem solid #000; font-size: 0.75rem;">Cantidad</th>
            <th style="border: 0.063rem solid #000; font-size: 0.75rem;">Total</th> 
        </tr>
            ${productos}
        </table>
        <div style="margin-top: 1.25rem; margin-bottom: 1.25rem;">
            <p style="font-size: 0.75rem; padding: 0; margin: 0; text-align: left;">Tipo de entrega: ${pedido.configuracion.envio ? 'Envio' : 'Retira en el local'}</p>
            <p style="font-size: 0.75rem; padding: 0; margin: 0; text-align: left;">Forma de pago: ${pedido.configuracion.pagoDigital ? 'Digital' : 'Efectivo'}</p>
            <p style="font-size: 0.75rem; padding: 0; margin: 0; text-align: left;">Abona con: ${pedido.configuracion.pagoEfectivo && pedido.configuracion.pagaCon ? formatter.format(pedido.configuracion.pagaCon) : '-'}</p>
            <p style="font-size: 0.75rem; padding: 0; margin: 0; text-align: left;">Vuelto: ${pedido.configuracion.pagoEfectivo && pedido.configuracion.pagaCon ? formatter.format(pedido.configuracion.pagaCon - pedido.total) : '-'}</p>
        </div>
        <div style="margin: 0; width: 100%; padding: 0;">
            <p style="font-size: 0.75rem; padding: 0; margin: 0;">${pedido.configuracion.direccion && pedido.configuracion.envio ? ('Direccion: ' + pedido.configuracion.direccion) : '-'}</p>
            <p style="font-size: 0.75rem; padding: 0; margin: 0;">${pedido.configuracion.numDep && pedido.configuracion.envio ? ('Numero/Depto: ' + pedido.configuracion.numDep) : '-'}</p>
            <p style="font-size: 0.75rem; padding: 0; margin: 0;">${pedido.configuracion.direccionInfo && pedido.configuracion.envio ? ('Info Adicional: ' + pedido.configuracion.direccionInfo) : '-'}</p>
        </div>
        <footer style="position: absolute; bottom: 2rem;">
            <p style="font-size: 1.125rem; padding: 0; margin: 0;">Total Pedido: ${formatter.format(pedido.total)}</p>
            <p style="font-size: 0.75rem; padding: 0; margin: 0; color: #9E9E9E;">${year} &copy Ciudad - App</p>
        </footer>
    </div>
    `;

    return content;
}

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  })
