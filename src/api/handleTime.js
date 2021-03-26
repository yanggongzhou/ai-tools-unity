export const handleScriptTime = (_time) => {
    const t = Number(_time)
    const h = Math.floor(t / 3600) < 10 ? Math.floor(t / 3600) : Math.floor(t / 3600);
    const m = Math.floor((t / 60 % 60)) < 10 ?  Math.floor((t / 60 % 60)) : Math.floor((t / 60 % 60));
    const s = Math.floor((t % 60)) < 10 ? Math.floor((t % 60)) : Math.floor((t % 60));

    let _t = '';
    if(h!=0) _t = `${h}h`;
    if(m!=0) _t += `${m}m`;
    if(s!=0) _t += `${s}s`;

    return _t;
}
