module.exports.factorization = function(rawtext) {    
    let re = /[^\s]+/g;
    let scdstr = rawtext.match(re);
    let scd = scdstr.map(str=>parseInt(str,10));
    let text = scd;
    const a = scd[1];
    const b = scd[2];
    const c = scd[3];
    let A = 0;
    let B = 0;
    let C = 0;
    let D = 0;
    let E = 0;
    let F = 0;
    let G = 0;
    let H = 0;
    let I = 0;
    let J = 0;
    let K = 0;
    let L = 0;
    let M = 0;
    let N = 0;
    let anstext = "";
    
  const checkInt = (a,b,c) => {
    a = parseInt(a);
    b = parseInt(b);
    c = parseInt(c);
    if (a===0||b===0||c===0) {
        specialCase(a,b,c);
    }else{
        calc(a,b,c);
    }
  }

  const specialCase = (a,b,c) => {
    var sign = "";
    if (a<0) {a = -a; b = -b; c = -c; var sign = '-';}
    if (a===0 && b===0 && c===0) {text = 0;}
    if (a===0 && b===0 && c!==0) {text = c;}
    if (a===0 && b!==0 && c===0) {text = changeMinus(b)+'x';}
    if (a!==0 && b===0 && c===0) {text = sign+changeToBlank(a)+'x²';}
    if (a===0 && b!==0 && c!==0) {text = changeMinus(b)+'x'+changeToPlus(c);}
    if (a!==0 && b!==0 && c===0) {
        let str = makeCoefficient(a,b);
        text = `${sign}${changeToBlank(str[2])}x(${str[0]}x${changeToPlus(str[1])})`;
    }
    if (a!==0 && b===0 && c!==0) {
        let subA = a;
        console.log(a,c);
        [a,c] = reduction2(a,c);
        M = subA / a;
        let i = "";
        if (c>0) i = 'i';
        else c = -c;
        let inRoot = a;
        let irrationalNum = factorOut(inRoot);
        let [aOutRoot,aInRoot] = [irrationalNum[0],irrationalNum[1]];
        inRoot = c;
        irrationalNum = factorOut(inRoot);
        let [cOutRoot,cInRoot] = [irrationalNum[0],irrationalNum[1]];
        console.log(aInRoot,cInRoot);
        let coefficient = 1;
        [aOutRoot,cOutRoot,coefficient] = makeCoefficient(aOutRoot,cOutRoot);
        M *= coefficient || 1;
        M = changeToBlank(M);
        console.log(aInRoot,aOutRoot,cInRoot,cOutRoot,coefficient);
        text = `${sign}${M}(${changeToBlank(aOutRoot)}${changeRoot(aInRoot)}x+${changeToBlank(cOutRoot)}${changeRoot(cInRoot)}${i})(${changeToBlank(aOutRoot)}${changeRoot(aInRoot)}x-${changeToBlank(cOutRoot)}${changeRoot(cInRoot)}${i})`
    }
  }

  const changeToBlank = x => {
    if (x===1) x = "";
    return x;
  }

  const changeToMinus = x => {
    if (x===-1) x = '-';
    return x;
  }

  const changeToPlus = x => {
    if (x>0) x = '+'+x;
    return x;
  }

  const changeMinus = x => {
    x = changeToBlank(x);
    x = changeToMinus(x);
    return x;
  }

  const changeSign = x => {
    x = changeToBlank(x);
    x = changeToPlus(x);
    return x;
  }

  const changeRoot = x => {
    if (x===1) x = "";
    if (x!=1&&x!=0) x = "√"+x;
    return x;
  }

  const makeCoefficient = (a,b) => {
    var coefficient = 1;
    for (let x = 2;x <= a && x <= Math.abs(b);){
        if (a%x === 0 && b%x === 0){
            a /= x;
            b /= x;
            coefficient *= x;
        }else{
            x++;
        }
    }
    if (a===1) a = "";
    if (coefficient===1) coefficient = "";
    return [a,b,coefficient];
  }

  const checkCoefficient = (A,G,a,M) => {
    console.log(A,G,a,M); 
    if (A*G>a) {
        let numerator = a*M;
        let denominator = A*G;
        console.log(numerator,denominator,a,M);
        [numerator,denominator] = reduction2(numerator,denominator);
        console.log(numerator,denominator);
        numerator===1&&denominator===1 ? M = 1
        :denominator===1 ? M = numerator
        :M = `${numerator}/${denominator}`;
        console.log(M);
        return M;
    }else if (A*G<a) {
        let numerator = a;
        let denominator = A*G*M;
        [numerator,denominator] = reduction2(numerator,denominator);
        numerator===1&&denominator===1 ? M = 1
        :denominator===1 ? M = numerator
        :M = `${numerator}/${denominator}`;
        console.log(M);
        return M;
    }else{
        console.log(M);
        return M;
    }
  }

  const calc = (a,b,c) => {
    console.log(a,b,c);
    if (a<0) {a = -a; b = -b; c = -c; N = 1;}
    let subA = a;
    console.log(a,b,c);
    [a,b,c] = reduction(a,b,c);
    M = subA / a;
    console.log(M,a,b,c);
    let imaginaryNum = 0;
    let numerator = -b;
    let denominator = 2*a;
    b**2-4*a*c>0 ? calcPlus(a,b,c,imaginaryNum,numerator,denominator,M,N)
    :b**2-4*a*c<0 ? calcMinus(a,b,c,imaginaryNum,numerator,denominator,M,N)
    :calcZero(a,imaginaryNum,numerator,denominator,M,N)
  }

  const calcZero = (a,imaginaryNum,numerator,denominator,M,N) => {
    let outRoot = 0;
    let fraction = "";
    console.log(numerator,denominator,outRoot);
    fraction = reduction(numerator,denominator,outRoot);
    console.log(fraction);
    let coefficient = makeCoefficient(fraction[1],fraction[0]);
    console.log(coefficient);
    A = 1;
    G = 1;
    A *= coefficient[0] || 1;
    B = -coefficient[1];
    C = 0;
    D = 0;
    E = 0;
    F = imaginaryNum;
    G *= coefficient[0] || 1;
    H = -coefficient[1];
    I = 0;
    J = 0;
    K = 0;
    L = imaginaryNum;
    M = checkCoefficient(A,G,a,M);
    setAnswer(A,B,C,D,E,F,G,H,I,J,K,L,M,N);
  }

  const calcPlus = (a,b,c,imaginaryNum,numerator,denominator,M,N) => {
    console.log(a,b,c,imaginaryNum,numerator,denominator,M,N);
    let inRoot = b**2-4*a*c;
    let partOfRoot = "";
    partOfRoot = factorOut(inRoot);
    let outRoot = partOfRoot[0];
    inRoot = partOfRoot[1]
    console.log(outRoot,inRoot);
    if (inRoot!==1) {
        let fraction = "";
        fraction = reduction(numerator,denominator,outRoot);
        console.log(fraction);
        A = 1;
        G = 1;
        A *= fraction[1];
        B = -fraction[0];
        C = 1;
        D = fraction[2];
        E = inRoot;
        F = imaginaryNum;
        G *= fraction[1];
        H = -fraction[0];
        I = 1;
        J = fraction[2];
        K = inRoot;
        L = imaginaryNum;
        M = checkCoefficient(A,G,a,M);
        console.log(N);
        setAnswer(A,B,C,D,E,F,G,H,I,J,K,L,M,N);
    }else{
        let inRoot = b**2-4*a*c;
        let partOfRoot = "";
        partOfRoot = factorOut(inRoot);
        let outRoot = partOfRoot[0];
        inRoot = partOfRoot[1]
        console.log(outRoot,inRoot);
        let first = b + outRoot;
        let second = b - outRoot;
        let firstFraction = reduction2(first,denominator);
        console.log(firstFraction);
        let firstCoefficient = makeCoefficient(firstFraction[1],firstFraction[0]);
        console.log(firstCoefficient);
        let secondFraction = reduction (second,denominator,0);
        let secondCoefficient = makeCoefficient(secondFraction[1],secondFraction[0]);
        A = firstCoefficient[0] || 1;
        B = firstCoefficient[1];
        [C,D,E,F] = [0,0,0,0];
        G = secondCoefficient[0] || 1;
        H = secondCoefficient[1];
        [I,J,K,L] = [0,0,0,0];
        M = checkCoefficient(A,G,a,M);
        setAnswer(A,B,C,D,E,F,G,H,I,J,K,L,M,N);
    }
  }

  const calcMinus = (a,b,c,imaginaryNum,numerator,denominator,M,N) => {
    imaginaryNum = 1;
    let inRoot = 4*a*c-b**2;
    let partOfRoot = "";
    partOfRoot = factorOut(inRoot);
    let outRoot = partOfRoot[0];
    inRoot = partOfRoot[1]
    console.log(outRoot,inRoot);
    let fraction = "";
    fraction = reduction(numerator,denominator,outRoot);
    console.log(fraction);
    A = 1;
    G = 1;
    A *= fraction[1];
    B = -fraction[0];
    C = 1;
    D = fraction[2];
    E = inRoot;
    F = imaginaryNum;
    G *= fraction[1];
    H = -fraction[0];
    I = 1;
    J = fraction[2];
    K = inRoot;
    L = imaginaryNum;
    M = checkCoefficient(A,G,a,M);
    setAnswer(A,B,C,D,E,F,G,H,I,J,K,L,M,N);
  }

  const factorOut = (inRoot) => {
    let outRoot = 1;
    console.log(outRoot,inRoot);
    for (let x = 2;x <= inRoot;) {
        if (inRoot%x**2 === 0) {
            outRoot *= x;
            inRoot /= x**2;
            console.log(x,outRoot,inRoot);
        }else{
            x++;
        }
        if (x>=100000) {
            inRoot = '???';
            alert('PC保護のため計算を中止しました。これにより、根号内のくくり出しは行われません。');
        }
        console.log(x);
    }
    console.log(outRoot,inRoot);
    return [outRoot,inRoot];
  }

  const reduction2 = (numerator,denominator) => {
    console.log(numerator,denominator);
    for (let x = 2;x <= Math.abs(numerator) && x <= Math.abs(denominator);) {
        if (numerator%x === 0 && denominator%x === 0) {
            numerator /= x;
            denominator /= x;
            console.log(x,numerator,denominator);
        }else{
            x++;
        }
        if (x>=65537) {
            numerator = '???';
            denominator = '???';
        }
        console.log(x);
    }
    return [numerator,denominator];
  }

  const reduction = (numerator,denominator,outRoot) => {
    console.log(numerator,denominator,outRoot);
    for (let x = 2;x <= Math.abs(numerator) && x <= Math.abs(denominator) && x <= outRoot;) {
        if (numerator%x === 0 && denominator%x === 0 && outRoot%x === 0) {
            numerator /= x;
            denominator /= x;
            outRoot /= x;
            console.log(x,numerator,denominator,outRoot);
        }else{
            x++;
        }
        if (x>=65537) {
            outRoot = '???';
        }
        console.log(x);
    }
    return [numerator,denominator,outRoot];
  }

  const setAnswer = (A,B,C,D,E,F,G,H,I,J,K,L,M,N) => {
    console.log(A,B,C,D,E,F,G,H,I,J,K,L,M,N);
    if (A==1) A = "";
    if (B>0) B = '+'+B;
    if (B==0) B = "";
    if (C==1) C = '+';
    if (C==0) C = "";
    if (D==1||D==0) D = "";
    if (E==1||E==0) E = "";
    if (E!=1&&E!=0) E = "√"+E;
    if (F==1) F = 'i';
    if (F==0) F = "";
    if (G==1) G = "";
    if (H>0) H = '+'+H;
    if (H==0) H = "";
    if (I==1) I = '-';
    if (I==0) I = "";
    if (J==1||J==0) J = "";
    if (K==1||K==0) K = "";
    if (K!=1&&K!=0) K = "√"+K;
    if (L==1) L = 'i';
    if (L==0) L = "";
    if (M==1) M = "";
    if (N==1) N = '-';
    if (N==0) N = "";
    let answer = N+M+'('+A+'x'+B+C+D+E+F+')('+G+'x'+H+I+J+K+L+')';
    anstext = answer;
  }
  checkInt(a,b,c);
  return anstext;
}