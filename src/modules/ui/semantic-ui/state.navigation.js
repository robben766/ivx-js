import {NavigationState as BasicNavigationState} from '../basic/state.navigation.js';

export class NavigationState extends BasicNavigationState {     
    constructor(data, linkSection){
        super(data, linkSection);
    }
    
    get defaultSectionClasses(){
        return 'ui container';
    }
    
    get defaultHeaderClasses(){
        return 'ui header';
    }
};