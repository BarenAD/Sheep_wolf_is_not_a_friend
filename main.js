window.onload = () => {
    let A = new Structure();
    let Result = A.find_solution();
    paint_result(Result);
};

class Structure
{
    constructor()
    {
        this.Find_Solution = [];
        this.steps = 1;
        this.Story = new Story_States();
        this.ROOT = new Node(
            null,
            {},
            {
                sheep: true,
                wolf: true,
                cabbage: true
            },
            "right",
            "base"
        );
        this.Story.register_state(this.ROOT.get_right_state());
        this.current = new Node(
            this.ROOT,
            {sheep: true},
            {
                wolf: true,
                cabbage: true
            },
            "left",
            "<= [sheep]"
        );
        this.ROOT.add_children(this.current);
        this.Story.register_state(this.current.get_right_state());
    }

    find_solution()
    {
        while (this.steps < 500 && !this.__check_congratulations(this.current.get_left_state())){
        //while (this.steps < 500 && (this.current.get_parent() !== null || this.current.get_first_children() !== null)){
            let amount_ways = this.current.get_amount_childrens();
            if (amount_ways < 1) {
                const left_state = this.current.get_left_state();
                const right_state = this.current.get_right_state();
                if (!this.__check_congratulations(left_state)) {
                    if (this.current.get_boat() === "left") {
                        Object.keys(left_state).map(key => {
                            let TempLeftState = JSON.parse(JSON.stringify(left_state));
                            let TempRightState = JSON.parse(JSON.stringify(right_state));
                            TempRightState[key] = true;
                            delete TempLeftState[key];
                            if (this.__check_the_opportunity_move(TempLeftState)) {
                                if (!this.Story.check_up_on_repetition(TempRightState)) {
                                    this.current.add_children(new Node(
                                        this.current,
                                        TempLeftState,
                                        TempRightState,
                                        "right",
                                        "[" + key + "] => "
                                    ));
                                    this.Story.register_state(TempRightState);
                                }
                            }
                        });
                    } else {
                        Object.keys(right_state).map(key => {
                            let TempLeftState = JSON.parse(JSON.stringify(left_state));
                            let TempRightState = JSON.parse(JSON.stringify(right_state));
                            TempLeftState[key] = true;
                            delete TempRightState[key];
                            if (this.__check_the_opportunity_move(TempRightState)) {
                                if (!this.Story.check_up_on_repetition(TempRightState)) {
                                    this.current.add_children(new Node(
                                        this.current,
                                        TempLeftState,
                                        TempRightState,
                                        "left",
                                        " <= [" + key + "]"
                                    ));
                                    this.Story.register_state(TempRightState);
                                }
                            }
                        });
                    }
                    if (this.__check_the_opportunity_move(left_state)
                        &&
                        this.__check_the_opportunity_move(right_state)
                    ) {
                        let Parent = this.current.get_parent();
                        if (right_state !== Parent.get_right_state()
                            ||
                            left_state !== Parent.get_left_state()
                        ) {
                            let temp_boat = null;
                            let temp_move = null;
                            if (this.current.get_boat() === "left") {
                                temp_boat = "right";
                                temp_move = "[] => ";
                            } else {
                                temp_boat = "left";
                                temp_move = "<= []";
                            }
                            this.current.add_children(new Node(
                                this.current,
                                left_state,
                                right_state,
                                temp_boat,
                                temp_move
                            ));
                        }
                    }
                }
            }
            let next_way = this.current.get_first_children();
            if (next_way === null) {
                if (this.current.get_parent() !== null) {
                    this.current = this.current.get_parent();
                }
            } else {
                this.current = next_way;
                if (this.__check_congratulations(this.current.get_left_state())) {
                    this.Find_Solution.push(this.current);
                }
            }
            this.steps++;
        }
        return this.Find_Solution;
    }

    __check_congratulations(left_state)
    {
        if (left_state["sheep"] && left_state["wolf"] && left_state["cabbage"]){
            return true;
        }
        return false;
    }

    __check_the_opportunity_move(state)
    {
        if (state["sheep"] && Object.keys(state).length > 1){
            return false;
        }
        return true;
    }
}

class Node
{
    constructor(in_parent, in_left_state, in_right_state, in_boat, in_move)
    {
        this.parent = in_parent;
        this.boat = in_boat;
        this.move = in_move;
        this.left_state = in_left_state;
        this.right_state = in_right_state;
        this.childrens = [];
        this.childrens_passed = [];
    }

    get_move()
    {
        return this.move;
    }

    get_boat()
    {
        return this.boat;
    }

    get_parent()
    {
        return this.parent;
    }

    get_right_state()
    {
        return this.right_state;
    }

    get_left_state()
    {
        return this.left_state;
    }

    add_children(in_children)
    {
        this.childrens.push(in_children);
        this.childrens_passed.push(false);
    }

    get_first_children()
    {
        let length = this.childrens.length;
        if (length > 0){
            for (let i = 0; i < length; i++)
            {
                if (this.childrens[i] !== null && !this.childrens_passed[i]){
                    this.childrens_passed[i] = true;
                    return this.childrens[i];
                }
            }
        }
        return null;
    }

    get_amount_childrens()
    {
        return this.childrens.length;
    }
}

class Story_States
{
    constructor()
    {
        this.Story = [];
    }

    register_state(in_state)
    {
        this.Story.push(in_state);
    }

    check_up_on_repetition(in_state)
    {
        let in_state_keys = Object.keys(in_state);
        let in_state_keys_length = in_state_keys.length;
        for (let i = 0; i < this.Story.length; i++){
            let time_period = this.Story[i];
            let time_period_keys = Object.keys(time_period);
            if (time_period_keys.length === in_state_keys_length) {
                let keys_match = 0;
                in_state_keys.map(key => {
                    if (time_period[key] === true){
                        keys_match++;
                    }
                });
                if (keys_match === in_state_keys_length) {
                    return true;
                }
            }
        }
        return false;
    }
}