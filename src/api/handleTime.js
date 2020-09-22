export const handleScriptTime = (_time) => {
    const t = Number(_time)
    const h = Math.floor(t / 3600) < 10 ? Math.floor(t / 3600) : Math.floor(t / 3600);
    const m = Math.floor((t / 60 % 60)) < 10 ?  Math.floor((t / 60 % 60)) : Math.floor((t / 60 % 60));
    const s = Math.floor((t % 60)) < 10 ? Math.floor((t % 60)) : Math.floor((t % 60));

    let _t = '';
    if(h!=0) _t = `${h}小时`;
    if(m!=0) _t += `${m}分`;
    if(s!=0) _t += `${s}秒`;

    return _t;
}
