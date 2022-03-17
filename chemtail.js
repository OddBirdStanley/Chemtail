class Atom{
    constructor(x,y,r,mx,my,c,metal,group){
        this.x = x;
        this.y = y;
        this.r = r;
        this.mx = mx;
        this.my = my;
        this.c = c;
        this.rogue = false;
        this.dirty = false;
        this.metal = metal;
        this.group = group;
        this.updateTag();
        this.textColor();
    }
    updateTag(){
        this.tag = "";
        if(this.metal==="H" && this.group==="") this.tag = "H2";
        else if(this.metal==="H" && this.group==="OH") this.tag = "H2O";
        else{
            let balance = balanceValence(valence[this.metal],valence[this.group]);
            if(balance[0]>1){
                if(this.metal.match(/[A-Z]/g).length>1) this.tag+=`(${this.metal})${balance[0]}`;
                else this.tag+=`${this.metal}${balance[0]}`;
            }else this.tag+=this.metal;
            if(balance[1]>1){
                if(this.group.match(/[A-Z]/g).length>1) this.tag+=`(${this.group})${balance[1]}`;
                else this.tag+=`${this.group}${balance[1]}`;
            }else this.tag+=this.group;
        }
        this.dtag = this.tag;
        for(i = 48; i<58; i++){
            this.dtag = this.dtag.replace(String.fromCharCode(i),String.fromCharCode(i+8272));
        }
    }
    textColor(){
        let tester = document.createElement("div");
        tester.style.color = this.c;
        document.body.appendChild(tester);
        let rgb = window.getComputedStyle(tester).color.match(/\d+/g);
        tester.remove();
        for(i = 0; i<rgb.length; i++){
            rgb[i] /= 255;
            if(rgb[i]<0.03928){
                rgb[i] /= 12.92;
            }else{
                rgb[i] += 0.055;
                rgb[i] /= 1.055;
                rgb[i] = Math.pow(rgb[i],2.4);
            }
        }
        let luminance = 0.2126*rgb[0] + 0.7152*rgb[1] + 0.0722*rgb[2];
        this.tc = (luminance+0.05)/0.05>1.05/(luminance+0.05) ? "black" : "white";
    }
}

class Element{
    constructor(atomicNumber,symbol,name,isotope,protons,neutrons,mass,category,group,period,oxidization){
        this.atomicNumber = atomicNumber;
        this.symbol = symbol;
        this.name = name;
        this.isotope = isotope;
        this.protons = protons;
        this.neutrons = neutrons;
        this.mass = mass;
        this.category = category;
        this.group = group;
        this.period = period;
        this.oxidization = oxidization;
    }
}
const elements = {
    Fe: new Element(26,"Fe","Iron",56,26,30,55.845,"Transition Metals",8,4,2),
    Li: new Element(3,"Li","Lithium",7,3,4,6.940,"Alkali Metals",1,2,1),
    Na: new Element(11,"Na","Sodium",23,11,12,22.990,"Alkali Metals",1,3,1),
    K: new Element(19,"K","Potassium",39,19,20,39.098,"Alkali Metals",1,4,1),
    Mg: new Element(12,"Mg","Magnesium",24,12,12,24.305,"Alkaline Earth Metals",2,3,2),
    Ca: new Element(20,"Ca","Calcium",40,20,20,40.078,"Alkaline Earth Metals",2,4,2),
    Ba: new Element(56,"Ba","Barium",138,56,82,137.327,"Alkaline Earth Metals",2,6,2),
    Al: new Element(13,"Al","Aluminium",27,13,14,26.982,"Boron Group",13,3,3),
    Pb: new Element(82,"Pb","Lead",208,82,126,207.200,"Carbon Group",14,6,2),
    Ni: new Element(28,"Ni","Nickel",58,28,30,58.693,"Transition Metals",10,4,2),
    Zn: new Element(30,"Zn","Zinc",64,30,34,65.380,"Transition Metals",12,4,2),
    Cu: new Element(29,"Cu","Copper",63,29,34,63.546,"Transition Metals",11,4,2),
    Ag: new Element(47,"Ag","Silver",107,47,60,107.868,"Transition Metals",11,5,2),
    Au: new Element(79,"Au","Gold",197,79,118,196.967,"Transition Metals",11,6,2)
}
const acids = {
    H2SO4: ["H<sub>2</sub>","+2","SO<sub>4</sub>","-2"],
    H3PO4: ["H<sub>3</sub>","+3","PO<sub>4</sub>","-3"],
    HI: ["H","+1","I","-1"],
    HCl: ["H","+1","Cl","-1"],
    CO2: ["H<sub>2</sub>","+2","CO<sub>3</sub>","-2"],
    HBr: ["H","+1","Br","-1"],
    HNO3: ["H","+1","NO<sub>3</sub>","-1"],
    HF: ["H","+1","F","-1"],
    H2CrO4: ["H<sub>2</sub>","+2","CrO<sub>4</sub>","-2"]
}

const reactivity = ["K","Na","Li","Ba","Ca","Mg","Al","Zn","Fe","Ni","Pb","Cu","Ag","Au"];
const strength = ["I","Br","Cl","NO3","SO4","PO4","F","CrO4","CO3"];
const precitipation = [
    "MgF","CaF","PbF",
    "AgCl",
    "MgOH","AlOH","CuOH","ZnOH","PbOH","NiOH",
    "MgCO3","CaCO3","AgCO3","ZnCO3","PbCO3","NiCO3",
    "BaSO4","PbSO4",
    "MgPO4","CaPO4","AlPO4","CuPO4","AgPO4","ZnPO4","LiPO4","PbPO4","NiPO4",
    "AgI","PbI",
    "AgBr",
    "BaCrO4","FeCrO4","CuCrO4","AgCrO4","ZnCrO4","PbCrO4"
];
const color = {
    SO4: "midnightblue",
    Cl: "lawngreen",
    NO3: "crimson",
    PO4: "darkcyan",
    CO3: "darkmagenta",
    F: "darkorange",
    OH: "mediumpurple",
    I: "burlywood",
    Br: "darkorchid",
    CrO4: "fuchsia",
    HPO4: "indianred",
    HCO3: "palegreen"
}
const valence = {
    K: 1,
    Na: 1,
    Li: 1,
    Ca: 2,
    Mg: 2,
    Al: 3,
    Zn: 2,
    Fe: 2,
    Ba: 2,
    Pb: 2,
    Ni: 2,
    Cu: 2,
    Ag: 1,
    Au: 1,
    H: 1,
    OH: -1,
    SO4: -2,
    CO3: -2,
    NO3: -1,
    F: -1,
    Cl: -1,
    PO4: -3,
    I: -1,
    Br: -1,
    CrO4: -2,
    HPO4: -2,
    HCO3: -1
};
const forbidden = ["AgOH"];
const pi = Math.PI;
const frame = document.getElementById("frame");
const fps = 25;
const driver = frame.getContext("2d");

let customReactions = {
    "Na&CO3&H&PO4": "Na&HPO4&H&CO3", "Na&HPO4&Na&OH": "Na&PO4&H&OH"
};
let balls = [];
let interval;
let stopped = true;
//0: new; 1: remove; 2: create
let mode = 0;
let showVelocities = false;
let hits = 0;

frame.width = 700;
frame.height = 350;
driver.textAlign = "center";
driver.textBaseline = "middle";
driver.strokeStyle = "darkseagreen";
driver.font = "12px sans-serif";

function lcm(x,y){
    if(typeof(x)!=="number" || typeof(y)!=="number" || x<1 || y<1) return null;
    let z = x*y;
    while(x!==y){
        if(x>y) x-=y;
        else y-=x;
    }
    return z/x;
}
function balanceValence(vx,vy){
    if(vx===0 || vy===0 || (vx<0 && vy<0) || (vx>0 && vy>0)) return null;
    if(vx<0) vx *= -1;
    if(vy<0) vy *= -1;
    let l = lcm(vx,vy);
    return [l/vx,l/vy];
}
function loop(collection,call){
    for(i = 0; i<collection.length; i++){
        call(collection[i]);
    }
}
function contains(array,element){
    for(i = 0; i<array.length; i++){
        if(array[i]===element) return true;
    }
    return false;
}
function either(a,b,call){
    return call(a) || call(b);
}
function eitherSwap(a,b,call){
    return call(a,b) || call(b,a);
}
function balanceEquation(a,b,c,d,pa,pb){
    let an = a;
    let bn = b;
    let cn = c;
    let dn = d;
    a = breakBrackets(a);
    b = breakBrackets(b);
    c = breakBrackets(c);
    d = breakBrackets(d);
    let l = tally([a,b]);
    let r = tally([c,d]);
    let lk = Object.keys(l);
    let rk = Object.keys(r);
    if(lk.length!==rk.length) return;
    for(i = 0; i<lk.length; i++){
        if(!contains(rk,lk[i]) || !contains(lk,rk[i])) return;
    }
    let ret = [-1,-1,-1,-1];
    main:
    for(x = 1; x<11; x++){
        for(y = 1; y<11; y++){
            for(z = 1; z<11; z++){
                for(w = 1; w<11; w++){
                    let equal = true;
                    lk.forEach(function(e){
                        if(l[e][0]*x+l[e][1]*y!==r[e][0]*z+r[e][1]*w){
                            equal = false;
                        }
                    });
                    if(equal){
                        ret = [x===1?"":String(x),y===1?"":String(y),z===1?"":String(z),w===1?"":String(w)];
                        break main;
                    }
                }
            }
        }
    }
    document.getElementById("equation").innerHTML = `\\(\\ce{${ret[0]}${an} + ${ret[1]}${bn}->${ret[2]}${cn} ${cn==="H2"?"^":(pa?"v":"")} ${dn==="" ? "}\\)" : `+ ${ret[3]}${dn} ${dn==="H2"?"^":(pb?"v":"")}}\\)`}`;
    MathJax.typeset([document.getElementById("equation")]); //TODO async
}
function breakBrackets(i){
    let groups = /\((.*?)\)(\d*)/g.exec(i);
    while(groups!=null){
        let start = groups.index;
        let parts = groups[1].match(/([A-Z][a-z]*\d*)/g);
        let multiplier = groups[2]==="" ? 1 : Number(groups[2]);
        for(j = 0; j<parts.length; j++){
            let count = /([A-Za-z]+)(\d*)/g.exec(parts[j]);
            parts[j] = [count[1],count[2]==="" ? String(multiplier) : String(Number(count[2])*multiplier)];
            if(parts[j][1]==="1") parts[j][1]="";
        }
        let ret = "";
        parts.forEach(e => ret+=e[0]+e[1]);
        i = breakBrackets(i.substring(0,start)+ret+i.substring(start+groups[0].length,i.length));
        groups = /\((.*?)\)(\d*)/g.exec(i);
    }
    return i;
}
function tally(l){
    let data = {};
    for(i = 0; i<l.length; i++){
        let re = l[i].match(/([A-Z][a-z]*\d*)/g);
        if(re!==null){
            re.forEach(function(j){
                let k = /([A-Za-z]+)(\d*)/g.exec(j);
                if(k[2]==="") k[2]="1";
                if(data[k[1]]===undefined) data[k[1]] = Array(l.length).fill(0);
                data[k[1]][i] += Number(k[2]);
            });
        }
    };
    return data;
}

function ctDrawCircle(atom){
    driver.fillStyle = atom.c;
    driver.beginPath();
    driver.arc(atom.x,atom.y,atom.r,0,pi*2,false);
    driver.fill();
    if(showVelocities){
        driver.beginPath();
        driver.moveTo(atom.x,atom.y);
        driver.lineTo(atom.x+atom.mx,atom.y+atom.my);
        driver.stroke();
    }
    driver.fillStyle = atom.tc;
    driver.fillText(atom.dtag,atom.x,atom.y);
}
function ctReset(){
    driver.clearRect(0,0,frame.width,frame.height);
}
frame.addEventListener("mousedown",function(e){
    switch(mode){
        case 0:
            if(useType!==-1){
                if(useType===2 && useName==="") return;
                let rel = frame.getBoundingClientRect();
                let atomMetal = useType===2?useName.split("&")[0]:(useType===1?useName:"H");
                let atomGroup = useType===2?useName.split("&")[1]:(useType===1?function(){
                    for(i = 0; i<reactivity.length; i++){
                        if(reactivity[i]==="Mg") return "";
                        if(reactivity[i]===useName) return "OH";
                    }
                }():useName.replace(/H\d*/g,""));
                if(useName==="CO2") atomGroup="CO3";
                let atomColor = atomGroup!=="" ? color[atomGroup] : "lightskyblue";
                let atomDirection = Math.random() * pi * 2;
                balls.push(new Atom(e.clientX-rel.left,e.clientY-rel.top,20,10*Math.cos(atomDirection),10*Math.sin(atomDirection),atomColor,atomMetal,atomGroup));
                if(balls.length===1){
                    ctStart();
                }
                if(stopped){
                    balls.forEach(function(ball){
                        ctDrawCircle(ball);
                    });
                    let totalMomentum = 0;
                    balls.forEach(function(ball){
                        totalMomentum += ball.r*((Math.pow(ball.mx,2)+Math.pow(ball.my,2))/2);
                    });
                    document.getElementsByClassName("stat-value")[0].innerHTML = totalMomentum.toFixed(2);
                    document.getElementsByClassName("stat-value")[2].innerHTML = String(balls.length);
                }
            }
            break;
        case 1:
            let rel = frame.getBoundingClientRect();
            let remove;
            for(i = 0; i<balls.length; i++){
                if(Math.pow(Math.pow(e.clientX-rel.left-balls[i].x,2)+Math.pow(e.clientY-rel.top-balls[i].y,2),0.5)<balls[i].r){
                    remove = balls[i];
                    break;
                }
            }
            balls = balls.filter(function(v){
                return v !== remove;
            });
            if(stopped){
                ctReset();
                balls.forEach(function(ball){
                    ctDrawCircle(ball);
                });
            }
            let totalMomentum = 0;
            balls.forEach(function(ball){
                totalMomentum += ball.r*((Math.pow(ball.mx,2)+Math.pow(ball.my,2))/2);
            });
            document.getElementsByClassName("stat-value")[0].innerHTML = totalMomentum.toFixed(2);
            document.getElementsByClassName("stat-value")[2].innerHTML = String(balls.length);
            break;
    }
});
function ctStop(){
    if(!stopped){
        clearInterval(interval);
        stopped = true;
        document.getElementById("switch-progress").innerHTML = "Start";
    }
}
function ctStart(){
    if(stopped && balls.length>0){
        interval = setInterval(ctMain,1000/fps);
        stopped = false;
        document.getElementById("switch-progress").innerHTML = "Stop";
    }
}
document.getElementById("switch-progress").addEventListener("click",function(e){
    if(stopped){
        ctStart();
    }else{
        ctStop();
    }
    document.getElementById("switch-progress").innerHTML = stopped ? "Start" : "Stop";
});
document.getElementById("switch-mode").addEventListener("click",function(e){
    mode = mode===1 ? 0 : 1;
    document.getElementById("switch-mode").innerHTML = mode===1 ? "Add" : "Remove";
});
document.getElementById("switch-velocity").addEventListener("click",function(e){
    showVelocities = !showVelocities;
    document.getElementById("switch-velocity").innerHTML = showVelocities ? "Hide Velocities" : "Show Velocities";
});
document.getElementById("button-create").addEventListener("click",function(e){
    let classList = document.getElementById("button-create").classList;
    if(classList.contains("button-create-inactive")){
        useType = 2;
        let metalInfo = document.getElementById("metal-info-list");
        metalInfo.getElementsByTagName("h2")[0].innerHTML = "<wbr>";
        metalInfo.getElementsByTagName("h3")[0].innerHTML = "<wbr>";
        for(i = 0; i<9; i++){
            metalInfo.getElementsByTagName("li")[i].getElementsByTagName("span")[1].innerHTML = "<wbr>";
        }
        let acidInfo = document.getElementById("acid-info");
        acidInfo.getElementsByTagName("span")[0].innerHTML = "";
        acidInfo.getElementsByTagName("span")[1].innerHTML = "";
        updateSynthesizer();
        classList.remove("button-create-inactive");
        classList.add("button-create-active");
    }
});
function removeAtoms(name){
    let before = balls.length;
    balls = balls.filter(ball => ball.metal+ball.group!==name);
    if(before!==balls.length){
        balls.forEach(function(ball){
            ctDrawCircle(ball);
        });
        let totalMomentum = 0;
        balls.forEach(function(ball){
            totalMomentum += ball.r*((Math.pow(ball.mx,2)+Math.pow(ball.my,2))/2);
        });
        document.getElementsByClassName("stat-value")[0].innerHTML = totalMomentum.toFixed(2);
        document.getElementsByClassName("stat-value")[2].innerHTML = String(balls.length);
    }
}
document.getElementById("extra-buttons").getElementsByTagName("button")[0].addEventListener("click",function(e){removeAtoms("H");});
document.getElementById("extra-buttons").getElementsByTagName("button")[1].addEventListener("click",function(e){removeAtoms("HOH");});
function updateSynthesizer(){
    let m = document.getElementById("synthesizer-metal").value;
    let a = document.getElementById("synthesizer-acid").value;
    if(useType===2){
        if(!contains(forbidden,m+a)){
            useName = m+"&"+a;
        }else{
            useName = "";
        }
    }
}
document.getElementById("synthesizer-metal").addEventListener("change",updateSynthesizer);
document.getElementById("synthesizer-acid").addEventListener("change",updateSynthesizer);
function ctHeat(){
    if(!stopped){
        balls.forEach(function(ball){
            ball.mx *= 1.1;
            ball.my *= 1.1;
        });
    }
}
function ctCool(){
    if(!stopped){
        balls.forEach(function(ball){
            ball.mx /= 1.1;
            ball.my /= 1.1;
        });
    }
}
function ctClear(){
    balls = [];
    hits = 0;
    document.getElementById("equation").innerHTML = "None";
    document.getElementsByClassName("stat-value")[0].innerHTML = "0";
    document.getElementsByClassName("stat-value")[1].innerHTML = "0";
    document.getElementsByClassName("stat-value")[2].innerHTML = String(balls.length);
    ctReset();
}
function ctMain(){
    if(balls.length===0){
        ctStop();
        ctReset();
        return;
    }
    let annihilate = [];
    let create = [];
    balls.forEach(function(ball,ia){
        if(ball.x-2*ball.r>frame.width || ball.x+2*ball.r<0 || ball.y-2*ball.r>frame.height || ball.y+2*ball.r<0){
            annihilate.push(ball);
            return;
        }
        if(!ball.rogue){
            if(ball.x-ball.r+ball.mx/fps<0 || ball.x+ball.r+ball.mx/fps>frame.width){
                ball.mx *= -1;
                ball.rogue = true;
            }
            if(ball.y-ball.r+ball.my/fps<0 || ball.y+ball.r+ball.my/fps>frame.height){
                ball.my *= -1;
                ball.rogue = true;
            }
        }else if(ball.x>=ball.r && ball.x<=frame.width-ball.r && ball.y>=ball.r && ball.y<=frame.height-ball.r){
            ball.rogue = false;
        }
        balls.forEach(function(other,ib){
            let dist = Math.pow(ball.x-other.x,2)+Math.pow(ball.y-other.y,2);
            let rs = Math.pow(ball.r+other.r,2);
            let dot = (ball.mx-other.mx)*(ball.x-other.x)+(ball.my-other.my)*(ball.y-other.y);
            if(ia!==ib && !other.dirty && !ball.dirty && dist<=rs){
                // undef: nothing; 0: swap; 1: swap and CO2; 2: explosion; 3: slow; 4: custom; 5: bicarbonate
                let action = function(){
                    if(eitherSwap(ball,other,(x,y) => customReactions[x.metal+"&"+x.group+"&"+y.metal+"&"+y.group]!==undefined)) return 4;
                    if(ball.group==="" && other.group==="") return;
                    if(ball.group!=="" && other.group!==""){
                        if(ball.group==="CO3" && other.group==="CO3" && !(ball.metal==="H" && other.metal==="H") && either(ball,other,x => x.metal==="H")){
                            return 5; // bicarbonate reaction
                        }
                        if(ball.group===other.group || ball.metal===other.metal) return;
                        if(either(ball,other,x => x.metal==="H" && x.group==="OH")) return;
                        if(eitherSwap(ball,other,(x,y) => x.metal==="H" && y.group==="CO3")) return 1;
                        if(eitherSwap(ball,other,(x,y) => x.metal==="H" && y.group==="OH")) return 0;
                        if(either(ball,other,x => contains(precitipation,x.metal+x.group))) return;
                        if(eitherSwap(ball,other,(x,y) => contains(precitipation,x.metal+y.group))){
                            if(either(ball,other,x => x.metal==="H")){
                                let p = ball.metal==="H" ? ball.group : other.group;
                                let q = ball.metal==="H" ? other.group : ball.group;
                                for(i = 0; i<strength.length; i++){
                                    if(strength[i]===p) return 0;
                                    if(strength[i]===q) return;
                                }
                            }else return 0;
                        }else return;
                    }else{
                        let lone = ball.group==="" ? ball.metal : other.metal;
                        let another = ball.group==="" ? other.metal : ball.metal;
                        let anotherG = ball.group==="" ? other.group : ball.group;
                        if(lone==="H") return;
                        if(another==="H"){
                            if(anotherG==="OH"){
                                for(i = 0; i<reactivity.length; i++){
                                    if(reactivity[i]==="Mg") break;
                                    if(reactivity[i]===lone) return 2;
                                }
                                for(i = 0; i<reactivity.length; i++){
                                    if(reactivity[i]==="Cu") return;
                                    if(reactivity[i]===lone) return 3;
                                }
                            }else{
                                for(i = 0; i<reactivity.length; i++){
                                    if(reactivity[i]==="Cu") return;
                                    if(reactivity[i]===lone) return 0;
                                }
                            }
                        }else{
                            for(i = 0; i<reactivity.length; i++){
                                if(reactivity[i]===another) return;
                                if(reactivity[i]===lone) return 0;
                            }
                        }
                    }
                }();
                if(action!==undefined){ //TODO improve
                    let first = [ball.tag,other.tag];
                    let destroyOther = false;
                    switch(action){
                        case 4:
                            let result = customReactions[ball.metal+"&"+ball.group+"&"+other.metal+"&"+other.group];
                            if(result===undefined) result = customReactions[other.metal+"&"+other.group+"&"+ball.metal+"&"+ball.group];
                            result = result.split("&");
                            ball.metal = result[0];
                            ball.group = result[1];
                            other.metal = result[2];
                            other.group = result[3];
                            break;
                        case 5:
                            let m = ball.metal==="H" ? other.metal : ball.metal;
                            ball.metal = m;
                            ball.group = "HCO3";
                            annihilate.push(other);
                            destroyOther = true;
                            break;
                        default:
                            let t = ball.metal;
                            ball.metal = other.metal;
                            other.metal = t;
                            break;
                    }
                    if(ball.metal==="H" && ball.group==="HCO3"){
                        ball.group = "CO3";
                    }
                    if(other.metal==="H" && other.group==="HCO3"){
                        other.group = "CO3";
                    }
                    ball.updateTag();
                    ball.c = ball.group!=="" ? color[ball.group] : "lightskyblue";
                    ball.textColor();
                    if(!destroyOther){
                        other.updateTag();
                        other.c = other.group!=="" ? color[other.group] : "lightskyblue";
                        other.textColor();
                    }
                    balanceEquation(first[0],first[1],ball.tag,destroyOther ? "" : other.tag,contains(precitipation,ball.metal+ball.group),contains(precitipation,other.metal+other.group));
                }
                if(Math.pow(ball.x-ball.mx/fps-other.x+other.mx/fps,2)+Math.pow(ball.y-ball.my/fps-other.y+other.my/fps,2)>rs){
                    ball.mx -= (ball.x-other.x)*(2*other.r*dot)/((ball.r+other.r)*dist);
                    ball.my -= (ball.y-other.y)*(2*other.r*dot)/((ball.r+other.r)*dist);
                    other.mx -= (other.x-ball.x)*(2*ball.r*dot)/((ball.r+other.r)*dist);
                    other.my -= (other.y-ball.y)*(2*ball.r*dot)/((ball.r+other.r)*dist);
                    ball.dirty = true;
                    other.dirty = true;
                    hits += 1;
                }
            }
        });
        ball.x += ball.mx/fps;
        ball.y += ball.my/fps;
    });
    ctReset();
    let totalMomentum = 0;
    annihilate.forEach(function(ball){
        balls = balls.filter(v => v!==ball);
    });
    create.forEach(function(ball){
        balls.push(ball);
    });
    balls.forEach(function(ball){
        ctDrawCircle(ball);
        ball.dirty = false;
        totalMomentum += ball.r*((Math.pow(ball.mx,2)+Math.pow(ball.my,2))/2);
    });
    document.getElementsByClassName("stat-value")[0].innerHTML = totalMomentum.toFixed(3);
    document.getElementsByClassName("stat-value")[1].innerHTML = String(hits);
    document.getElementsByClassName("stat-value")[2].innerHTML = String(balls.length);
}

let useType = -1;
let useName = null;
let arrayAcid = document.getElementById("acid-list").children;
let arrayMetal = document.getElementById("select-metal").getElementsByTagName("td");
loop(arrayAcid,element => element.addEventListener("click",function(){
    if(useType===2){
        let classList = document.getElementById("button-create").classList;
        classList.remove("button-create-active");
        classList.add("button-create-inactive");
    }
    useType = 0;
    useName = element.textContent;
    loop(arrayAcid,element => element.classList.remove("acid-selected"));
    loop(arrayMetal,element => element.classList.remove("metal-selected"));
    element.classList.add("acid-selected");
    let metalInfo = document.getElementById("metal-info-list");
    metalInfo.getElementsByTagName("h2")[0].innerHTML = "<wbr>";
    metalInfo.getElementsByTagName("h3")[0].innerHTML = "<wbr>";
    for(i = 0; i<9; i++){
        metalInfo.getElementsByTagName("li")[i].getElementsByTagName("span")[1].innerHTML = "<wbr>";
    }
    let acidInfo = document.getElementById("acid-info");
    acidInfo.getElementsByTagName("span")[0].innerHTML = `<ruby>${acids[useName][0]}<rt>${acids[useName][1]}</rt></ruby>`;
    acidInfo.getElementsByTagName("span")[1].innerHTML = `<ruby>${acids[useName][2]}<rt>${acids[useName][3]}</rt></ruby>`;
}));
loop(arrayMetal,element => element.addEventListener("click", function(){
    if(element.classList.length===0){
        if(useType===2){
            let classList = document.getElementById("button-create").classList;
            classList.remove("button-create-active");
            classList.add("button-create-inactive");
        }
        useType = 1;
        useName = element.textContent.replace(/\d/g,"");
        loop(arrayAcid,element => element.classList.remove("acid-selected"));
        loop(arrayMetal,element => element.classList.remove("metal-selected"));
        element.classList.add("metal-selected");
        let metalInfo = document.getElementById("metal-info-list");
        metalInfo.getElementsByTagName("h2")[0].innerHTML = `<sub>${elements[useName].atomicNumber}</sub>${elements[useName].symbol}`;
        metalInfo.getElementsByTagName("h3")[0].innerHTML = elements[useName].name;
        metalInfo.getElementsByTagName("li")[0].getElementsByTagName("span")[1].innerHTML = `${elements[useName].atomicNumber}`;
        metalInfo.getElementsByTagName("li")[1].getElementsByTagName("span")[1].innerHTML = `<sup>${elements[useName].isotope}</sup>${elements[useName].symbol}`;
        metalInfo.getElementsByTagName("li")[2].getElementsByTagName("span")[1].innerHTML = `${elements[useName].protons}`;
        metalInfo.getElementsByTagName("li")[3].getElementsByTagName("span")[1].innerHTML = `${elements[useName].neutrons}`;
        metalInfo.getElementsByTagName("li")[4].getElementsByTagName("span")[1].innerHTML = `${elements[useName].mass} g/mol`;
        metalInfo.getElementsByTagName("li")[5].getElementsByTagName("span")[1].innerHTML = elements[useName].category;
        metalInfo.getElementsByTagName("li")[6].getElementsByTagName("span")[1].innerHTML = `${elements[useName].group}`;
        metalInfo.getElementsByTagName("li")[7].getElementsByTagName("span")[1].innerHTML = `${elements[useName].period}`;
        metalInfo.getElementsByTagName("li")[8].getElementsByTagName("span")[1].innerHTML = (elements[useName].oxidization<0 ? "" : "+") + `${elements[useName].oxidization}`;
        let acidInfo = document.getElementById("acid-info");
        acidInfo.getElementsByTagName("span")[0].innerHTML = "";
        acidInfo.getElementsByTagName("span")[1].innerHTML = "";
    }
}));