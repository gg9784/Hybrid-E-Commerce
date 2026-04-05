import dns from 'dns';

const srvRecord = '_mongodb._tcp.cluster0.qsylilg.mongodb.net';

dns.resolveSrv(srvRecord, (err, addresses) => {
    if (err) {
        console.error('Error resolving SRV:', err);
        process.exit(1);
    }
    
    console.log('SRV Records found:');
    addresses.forEach(addr => {
        console.log(`${addr.name}:${addr.port}`);
    });
    
    // Also try to resolve TXT records for options
    dns.resolveTxt('cluster0.qsylilg.mongodb.net', (err, records) => {
        if (!err) {
            console.log('\nTXT Records (Options):');
            records.forEach(rec => console.log(rec.join('')));
        } else {
            console.log('\nNo TXT records found.');
        }
    });
});
