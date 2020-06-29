$(document).ready(function () {

    $(`.moneyBtn`).click(addMoney);
    $(`#changeReturnBtn`).click(changeReturn);
    $(`#makePurchaseBtn`).click(makePurchase);



    function getAllItems(){
        $.ajax(
            {
                type: "GET",
                url: `http://tsg-vending.herokuapp.com/items`,
    
                success: function (data, status) {
                    $('#cards').empty();
                    for(var item of data){
                        var card = $(
                            `<div id="${item.id}" class="card col-md-3">
                                <p>${item.id}</p>
                                <p>${item.name}</p>
                                <p>Price: $${item.price}</p>
                                <p>Stock Available: ${item.quantity}</p>
                            </div>`
                        );
                        card.appendTo("#cards");
                        card.click('click', selectItem)
                    }
                },
    
                error: function (jqXHR, textStatus, errorThrown) {
                    displayMessage(errorThrown.message);
                }
            }
        );
    }

        function makePurchase(){
            $.ajax(
                {
                    type: "POST",
                    url: `http://tsg-vending.herokuapp.com/money/${$("#moneyInserted").val()}/item/${$("#itemIdField").val()}`,

                    success: function (data, status) {
                        clearInputs();
                        displayChange(data);
                        displayMessage("Thank You!");
                        getAllItems();
                    },

                    error: function (jqXHR, textStatus, errorThrown) {
                        displayMessage(jqXHR.responseJSON.message);
                    }
                }
            )
        }

    function selectItem(event) {
        $(`#itemIdField`).val(event.currentTarget.id);
    }

    function addMoney(event){
        $(`#messagesField`).val('');
        $(`#displayChangeField`).val('');

        var moneyInserted = $('#moneyInserted').val();
        if(moneyInserted.length === 0){ // If the value is and empty string, initialize as 0
            moneyInserted = 0;
        } else {
            moneyInserted = parseFloat(moneyInserted);
        }
        switch(event.target.id){
            case `dollar`:
                moneyInserted += 1.00
                break;
            case `quarter`: 
                moneyInserted += .25
                break;
            case `dime`:
                moneyInserted += .10
                break;
            case `nickel`:
                moneyInserted += .05
                break;
        }
        $('#moneyInserted').val(moneyInserted.toFixed(2));
    }

    function displayMessage(message){
        $(`#messagesField`).val(message);
    }

    function clearInputs(){
        $(`#moneyInserted`).val('0.00');
        $(`#messagesField`).val('');
        $(`#itemIdField`).val('');
        $(`#displayChangeField`).val('');
    }

    function displayChange(data){
        // var quarters = 0;
        // var dimes = 0;
        // var nickels = 0;
        // var pennies = 0;
        var changeReturned = "";

        for(let coin in data){
            console.log(coin);
            if(data[coin] !== 0){
                changeReturned += `${data[coin]} ${coin} `;
            }   
        }

        $(`#displayChangeField`).val(changeReturned);
        // quarters = data.quarters + " Quarter";
        // dimes = data.dime + " Dime";
        // pennies = data.nickels + " Nickel";
        // nickels = data.pennies + " Penn";

        

        // if(quarters !== 0){
        //     changeReturned += quarters;
        //     if(dimes !== 0){
        //         changeReturned += dimes;
        //         if(nickels !== 0){
        //             changeReturned += nickels;
        //             if(pennies !== 0){
        //                 if(pennies === 1){
        //                     changeReturned += pennies + "y"
        //                 }
        //                 if(pennies > 1){
        //                     changeReturned += pennies + "ies"
        //                 }
        //             }
        //         }
        //     }

        // }
    }

    function changeReturn() {
        console.log("Returning change");
        let change = {
            quarters: 0,
            dimes: 0,
            nickels: 0,
            pennies: 0
        };
        // Takes the moneyInserted from html
        let moneyString = $("#moneyInserted").val();
        if(moneyString.length === 0) return;
        let money = parseFloat(moneyString);
        while(money.toFixed(2) > 0){
            if(money.toFixed(2) >= .25){
                money -= .25;
                change.quarters++;
                continue;
            }
            if(money.toFixed(2) >= .10){
                money -= .10;
                change.dimes++;
                continue;
            }
            if(money.toFixed(2) >= .05){
                money -= .05;
                change.nickels++;
                continue;
            }
            if(money.toFixed(2) >= .01){
                money -= .01;
                change.pennies++;
                continue;
            }
        }
        clearInputs();
        displayChange(change);
    }
        // Calculates coins {quarters: 0, dimes: 0, nickels: 0, pennies: 0}
        
        // Displays coins

    getAllItems();
});