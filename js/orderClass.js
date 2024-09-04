class Order{
    constructor(){
        this.placedCart = []
        this.orderValue = 0
        this.objElementsPlacedCart = []
    }

    #addOrderValue(){
        const currency = this.orderValue.toLocaleString("en",{style:"currency",currency:"USD"})
        document.querySelectorAll(".value").forEach(item => item.innerHTML = currency)
    }

    #resetStyleBtnAndCarQuantity(arrBtn){
        document.querySelector(".cart h2").textContent = `Your Cart(${this.placedCart.length})`
        // atualizando a quantidade de sobremesas no carrinho

        arrBtn.forEach(item => {
            item.classList.remove("added")
            item.querySelector(".btn__amount").innerHTML = "1"
        })
        // removendo o estilo do botão das sobremesas adicionadas no carrinho e resetando a quantidade
    }

    addCart(cartList,data){
        const cartLi = document.createElement("li")
        const priceC = data.price.toLocaleString("en",{style:"currency",currency:"USD"})
        cartLi.setAttribute("class","list__items")
        cartLi.innerHTML = `
            <div class="items__description">
                <p>${data.name}</p>
                <span><span class="quantity">1x</span>@ ${priceC}<span class="price">${priceC}</span></span>
            </div>
            <span class="items__icon-remove"><i class="fa-solid fa-xmark"></i></span>
        `
        // cria o item que vai ser adicionado no carrinho

        const nameCartLi = cartLi.querySelector(".items__description > p").innerHTML

        if(!this.placedCart.some(item => item.textContent.includes(nameCartLi))){
            // impedindo a adição de itens repetidos
            this.orderValue += data.price
            this.#addOrderValue()

            this.objElementsPlacedCart.push({element:cartLi,quantity:1,price:data.price})

            cartList.appendChild(cartLi)
            this.placedCart.push(cartLi)

            const iconRemoves = cartLi.querySelector(".items__icon-remove")
            iconRemoves.addEventListener("click", (e) => {
                const nameElement = e.currentTarget.parentElement.querySelector(".items__description > p").innerHTML
                this.removeCart(e.currentTarget.parentElement,nameElement)
            })
            // colocando a sobremesa no carrinho e no placedCart

            document.querySelector(".cart h2").textContent = `Your Cart(${this.placedCart.length})`        
            // atualizando a quantidade de sobremesas no carrinho

            document.querySelector(".cart").classList.add("containing")

            const confirmedTotal = document.querySelector(".order-confirm__total")
            const confirmedLi = document.createElement("li")
            confirmedLi.setAttribute("class","list__items")
            confirmedLi.innerHTML = `
            <div class="items__description">
                <img src="${data.image.thumbnail}" class="item__img">
                <div>
                    <p>${data.name}</p>
                    <span><span class="quantity">1x</span>@ ${priceC}</span>
                </div>
            </div>
            <span class="price">${priceC}</span>
            `

            confirmedTotal.insertAdjacentElement("beforebegin", confirmedLi)
            // colocando a sobremesa na confirmação de pedido
        }
    }

    removeCart(element,name){                  
        const placedCartItem = this.objElementsPlacedCart.find(item => item.element == element)
        const dessertsMenu = Array.from(document.querySelector(".desserts__menu").children)
        let menuChild

        dessertsMenu.forEach(item => {
            const nameItem = item.querySelector(".items__name-price p:nth-of-type(2)").innerHTML
            if(nameItem === name){
                menuChild = item
            }
        })
        // pega o elemento do menu referente ao excluído da lista

        this.objElementsPlacedCart = this.objElementsPlacedCart.filter(item =>  item.element != element)

        menuChild.querySelector(".btn__amount").innerHTML = "1"
        menuChild.querySelector(".items__img").classList.remove("embroidery")

        const childBtn = [menuChild.querySelector(".items__btn")]

        this.placedCart = this.placedCart.filter(item => item !== element)        
        if(this.placedCart.length == 0){
            document.querySelector(".cart").classList.remove("containing")
        }
        // verifica se o carrinho não tem nenhum item e remove a classe containing para aparecer a tela de nenhum item no carrinho

        const orderConfirm = Array.from(document.querySelectorAll(".order-confirm__list .list__items"))
        orderConfirm.find(item => item.textContent.includes(name)).remove()

        // removendo as sobremesas da lista de confirmação de pedido

        this.orderValue -= (placedCartItem.price*placedCartItem.quantity)
        this.#addOrderValue()
        this.#resetStyleBtnAndCarQuantity(childBtn)
        element.remove()
        // subtrai e atualiza o valor total, retira o estilo de adicionado, e remove o item do DOM
    }

    changeQuantity(element,signal){
        const nameDessert = element.querySelector(".items__name-price > p:nth-of-type(2)").innerHTML
        const listItem = this.objElementsPlacedCart.find(item => item.element.textContent.includes(nameDessert))

        // pega o nome da sobremesa e depois com o nome, o objeto do elemento

        if(signal === "+"){
            listItem.quantity++
        } else if(signal === "-"){
            listItem.quantity-- 
        } else {
            this.removeCart(listItem.element,nameDessert)
            return
        }
        // condicional que vai determinar a adição, subtração ou remoção do elemento no carrinho

        listItem.finalValue = (listItem.price*listItem.quantity).toLocaleString("en",{style:"currency",currency:"USD"})
        // cria uma propriedade com o valor final convertido em moeda(dólar)

        this.orderValue = 0
        this.objElementsPlacedCart.forEach(item => {
            this.orderValue += item.price*item.quantity
        })
        // valor do pedido é zerado e depois somado com o preçoXquantidade dos produtos

        document.querySelectorAll(".quantity").forEach(item => {
            if(item.parentElement.previousElementSibling.innerHTML == nameDessert){
                item.innerHTML = `${listItem.quantity}x`
            }
        })
        // pega as quantidades da lista e atualiza se tiver o nome do elemento
        
        document.querySelectorAll(".price").forEach(item =>{
            const priceNameDessert =
            (item.previousElementSibling.querySelector("div p") || 
            item.parentElement.previousElementSibling)
            // pega o nome da sobremesa, porém, os elementos com a classe "price" estão em 2 estruturas diferentes, dependendo de onde estão é pego de uma forma diferente
            
            if(priceNameDessert.innerHTML === nameDessert){
                item.innerHTML = `${listItem.finalValue}`
            }
        })
        // pega os preços e atualiza se tiver o nome

        this.#addOrderValue()
    }

    confirm(){
        document.querySelector(".order-confirm").style.display = "block"
        document.querySelector(".black-back").style.display = "block"
        // exibindo a tela de confirmação de pedido

        this.placedCart = []
        this.#resetStyleBtnAndCarQuantity(Array.from(document.querySelectorAll(".items__btn")))

        document.querySelector(".cart").classList.remove("containing")
        document.querySelector(".cart__list").replaceChildren()
        
        this.objElementsPlacedCart = []
    }

    newOrder(){
        this.orderValue = 0
        
        document.querySelector(".order-confirm").style.display = "none"
        document.querySelector(".black-back").style.display = "none"
        // retirando tela de confirmação de pedido

        document.querySelectorAll(".order-confirm__list .list__items").forEach(item => {
            item.remove()
        })
        // removendo as sobremesas da lista de confirmação de pedido

        document.querySelectorAll(".items__img").forEach(item => {
            item.classList.remove("embroidery")
        })
     }
}

export default new Order()