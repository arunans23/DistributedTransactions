import * as dmUtils from "./dm-utils";

/*
* title : "root",
* inputType : "JSON",
*/
interface Root {
    id: string
    items: {
        productId: string
        quantity: number
    }[]
    payment: string
}


/*
* title : "Order",
* outputType : "XML",
*/
interface Order {
    customerId: string
    orderItems: {
        productId: string
        quantity: number
    }[]
    paymentMethod: string
}


/**
 * functionName : map_S_root_S_Order
 * inputVariable : inputroot
*/
export function mapFunction(input: Root): Order {
    return {
        customerId: input.id,
        paymentMethod: input.payment,
        orderItems: input.items
            .map((itemsItem) => {
                return {
                    productId: "P" + itemsItem.productId,
                    quantity: itemsItem.quantity
                }
            })
    }
}

