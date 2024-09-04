
(async() => {
    try{
        const response = await fetch("data.json")
        const data = await response.json()
    
        const documentFrag = document.createDocumentFragment()    
        data.forEach(item => {
            const menuItem = document.createElement("div")
            menuItem.setAttribute("class","menu__items")
            menuItem.innerHTML = `
            <picture>
                <source media="(min-width:1350px)" srcset="${item.image.desktop}">
                <source media="(min-width:700px)" srcset="${item.image.tablet}">
                <img src="${item.image.mobile}" class="items__img">
            </picture>
            <button class="items__btn"><div class="noadded-mode"><i class="fa-solid fa-cart-plus"></i>Add to Cart</div><div class="added-mode"><div class="btn__more-less">-</div><div class="btn__amount">1</div><div class="btn__more-less">+</div></div></button>
            <div class="items__name-price">
                <p>${item.category}</p>
                <p>${item.name}</p>
                <p>$${item.price}</p>
            </div>
            `
    
            documentFrag.append(menuItem)
        })
    
        const desserts = document.querySelector(".desserts__menu")
        desserts.appendChild(documentFrag)
    
        // Adicionando as comidas no DOM
    
        const itemBtn = document.querySelectorAll(".items__btn")
        itemBtn.forEach(item => {
            item.addEventListener("click", (a) => {
                const moreLess = Array.from(a.currentTarget.querySelectorAll(".btn__more-less"))
    
                if(!moreLess.includes(a.target)){
                    item.parentElement.querySelector(".items__img").classList.add("embroidery")
                    a.currentTarget.classList.add("added")
                    
                    const cartList = document.querySelector(".cart__list")
                    const nameDessert = item.parentElement.querySelector(".items__name-price p:nth-of-type(2)").innerHTML
                    const dessertData = data.find(item => item.name === nameDessert)
    
                    Order.addCart(cartList,dessertData)
    
                }
            })
        })
    
        const addedMode = document.querySelectorAll(".added-mode")
        addedMode.forEach(item => {
            const menuItem = item.parentElement.parentElement
            const moreLess = item.querySelectorAll(".btn__more-less")
            moreLess.forEach(_item => {
                _item.addEventListener("click", (e) => {
                    let amount = e.currentTarget.parentNode.querySelector(".btn__amount")
                    let amountValue = Number(amount.innerHTML)
    
                    if(e.currentTarget == moreLess[0]){
                        if(amountValue == 1){
                            item.parentElement.classList.remove("added")
                            Order.changeQuantity(menuItem)
                        } else {
                            amountValue--
                            amount.replaceChildren(amountValue)
                            Order.changeQuantity(menuItem,e.currentTarget.innerHTML)
                        }
                    } else {
                        amountValue++
                        amount.replaceChildren(amountValue)
                        Order.changeQuantity(menuItem,e.currentTarget.innerHTML)
                    }
                })
            })
        })
    
        // adicionando comidas no carrinho
    
        const btnConfirm = document.querySelector(".cart__btn-confirm")
        btnConfirm.addEventListener("click", () => {
            Order.confirm()
        })
    
        const btnStart = document.querySelector(".order-confirm__start")
        btnStart.addEventListener("click", () => {
            Order.newOrder()
        })
    
        document.addEventListener("keydown", (e) => {
            const backDisplay = document.querySelector(".black-back").getAttribute("style") || ""
            if(e.keyCode === 27 && !backDisplay.includes("none")){
                Order.newOrder()
            }
        })
    
        document.querySelector(".black-back").addEventListener("click", () => {
            Order.newOrder()
        })
    
        // finalizando e iniciando um novo pedido
    
        const confirmList = document.querySelector(".order-confirm__list")
    
        const confirmListObserver = new MutationObserver((e) => {
            e = e[0]
            if(e.target.children.length > 4){
                e.target.classList.add("shorten")
            } else{ 
                e.target.classList.remove("shorten")
            }
        })
    
        const configs = {childList:true}
    
        confirmListObserver.observe(confirmList,configs)
        // adicionando observador para aplicar overflow scroll na lista de confirmação de pedido
    } catch(err){
        console.log(new Error(err))
    }
})()


import Order from "./orderClass.js"

