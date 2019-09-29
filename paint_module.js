function paint_result(result_array) {
    let amount_result = result_array.length;
    let Body = document.getElementsByTagName("body")[0];
    if (amount_result > 0){
        for (let i = 0; i < amount_result; i++){
            let LastNode = false;
            let Table = document.createElement("table");
            Table.border = "1";
            let Caption = document.createElement("caption");
            let Temp_text_node = document.createTextNode("Solution #"+i);
            Caption.appendChild(Temp_text_node);
            Table.appendChild(Caption);
            let current = result_array[i];
            while (current.get_parent() !== null || !LastNode) {
                let New_Tr = create_tr(
                    current.get_left_state(),
                    current.get_right_state(),
                    current.get_move()
                );
                Table.insertBefore(New_Tr, Table.childNodes[1]);
                if (current.get_parent() !== null) {
                    current = current.get_parent();
                } else {
                    LastNode = true;
                }
            }
            Body.appendChild(Table);
        }
    } else {
        //Решений нет
    }
}

function create_tr(left_state, right_state, move) {
    let Left_td = create_td(Object.keys(left_state));
    let Right_td = create_td(Object.keys(right_state));
    let Move_td = document.createElement("td");
    let Move_value = document.createTextNode(move);
    let New_tr = document.createElement("tr");
    Move_td.appendChild(Move_value);
    New_tr.appendChild(Left_td);
    New_tr.appendChild(Move_td);
    New_tr.appendChild(Right_td);
    return New_tr;
}

function create_td(array_value) {
    let length_array = array_value.length;
    let New_td = document.createElement("td");
    let string_value_td = "";
    for (let i = 0; i < length_array; i++) {
        if (i === 0) {
            string_value_td += "[ " + array_value[i];
            if (length_array === 1) {
                string_value_td += " ]";
            } else {
                string_value_td += ", ";
            }
        } else if (i === length_array-1) {
            string_value_td += array_value[i] + " ]";
        } else {
            string_value_td += array_value[i] + ", ";
        }
    }
    let New_value_td = document.createTextNode(string_value_td);
    New_td.appendChild(New_value_td);
    return New_td;
}