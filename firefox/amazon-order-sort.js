// (some attribution)
// Sort icon created by Freepik. - https://www.flaticon.com/free-icons/sort

const deliveredToday = 0
const runningLate = 5
const tomorrow = 2
const today = 1

const weights = {
    'delivered': deliveredToday,
    'today': today,
    'tomorrow': tomorrow,

    'monday': 3,
    'tuesday': 3,
    'wednesday': 3,
    'thursday': 3,
    'friday': 3,
    'saturday': 3,
    'sunday': 3,

    'january': 4,
    'february': 4,
    'march': 4,
    'april': 4,
    'may': 4,
    'june': 4,
    'july': 4,
    'august': 4,
    'september': 4,
    'october': 4,
    'november': 4,
    'december': 4,

    'late': 5,
}

async function sortAmazonOrders() {
    const deliveryBoxes = document.querySelectorAll('.delivery-box')
    const shipmentBoxes = document.querySelectorAll('.a-box.shipment')
    const allShipmentElements = [...deliveryBoxes, ...shipmentBoxes]

    const container = document.querySelector('.your-orders-content-container__content')
    const timeframeHeader = container.querySelector('.a-row.a-spacing-base')

    const arrivalsContainer = createArrivalsContainer()
    const arrivalsHeader = createArrivalsHeader()
    arrivalsContainer.appendChild(arrivalsHeader)

    const arrivals = generateArrivals(allShipmentElements)

    // No arriving orders means we don't need to change or render anything.
    if (arrivals.length === 0) {
        return
    }

    arrivals.sort((a, b) => a.position - b.position)

    for (const order of arrivals) {
        styleOrderElement(order)
        styleProductImage(order)
        arrivalsContainer.appendChild(order.element)
    }

    timeframeHeader.insertAdjacentElement('afterend', arrivalsContainer)
    // Push to the next tick to allow the DOM to render the new elements first,
    // once the extension kicks in, then fade them in.
    setTimeout(() => {
        arrivalsContainer.style.opacity = '1'
    }, 0)
}

function styleProductImage(order) {
    const image = order.element.querySelector('.product-image') || order.element.querySelector('img')
    if (!image) {
        return
    }

    if (order.position === runningLate) {
        image.style.border = '1px #ffaaaa solid'
    }
    if (order.position === deliveredToday) {
        image.style.border = '1px #8CD273FF solid'
    }
    else if (order.position <= tomorrow) {
        image.style.border = '1px #FCD200 solid'
    }
}

function styleOrderElement(order) {
    order.element.style.border = '1px #FCD200 solid'
    order.element.style.width = '100%'
    order.element.style.margin = '0 0 4px 0'
    order.element.borderCollapse = 'collapse'
    order.element.opacity = '0'

    if (order.position === deliveredToday) {
        order.element.style.backgroundColor = '#b3ff98'
        order.element.style.border = '1px #8CD273FF solid'
    }
    if (order.position === today) {
        order.element.style.backgroundColor = '#FFED90'
    }
    if (order.position === tomorrow) {
        order.element.style.backgroundColor = '#FFF9E5'
    }
    if (order.position === runningLate) {
        order.element.style.border = '1px #ffaaaa solid'
        order.element.style.backgroundColor = '#ffeeee'
    }
}

function generateArrivals(orderElements) {
    const arrivals = []
    for (const deliveryElement of orderElements) {
        let orderPosition = 100
        const deliveryTextSpan = deliveryElement.querySelector('span.a-text-bold')
        const deliveryText = deliveryTextSpan.innerText.toLowerCase()

        if (deliveryText.includes('arriving') || deliveryText.includes('running') || deliveryText.includes('today')) {
            for (let word of deliveryText.split(' ')) {
                if (weights[word] < orderPosition) {
                    orderPosition = weights[word]
                }
            }
            arrivals.push({ element: deliveryElement, position: orderPosition })
        }
    }
    return arrivals
}

function createArrivalsHeader() {
    const arrivalsHeader = document.createElement('h2')
    arrivalsHeader.innerText = 'Arrivals'
    arrivalsHeader.style.margin = '8px'
    return arrivalsHeader
}

function createArrivalsContainer() {
    const arrivalsContainer = document.createElement('section')
    arrivalsContainer.style.margin = '0 0 8px 0'
    arrivalsContainer.style.width = '100%'
    arrivalsContainer.style.opacity = '0'
    arrivalsContainer.style.transition = 'opacity 0.5s ease-in-out'
    return arrivalsContainer

}

sortAmazonOrders()
