fetch(`${window.location.origin}/dados`)
    .then(res => res.json())
    .then(data => {
        const head = document.getElementById('tabela-head');
        const body = document.getElementById('tabela-body');

        if (data.length === 0) return;

        const headers = Object.keys(data[0]);
        const headerRow = document.createElement('tr');
        headers.forEach(h => {
            const th = document.createElement('th');
            th.textContent = h;
            headerRow.appendChild(th);
        });
        head.appendChild(headerRow);

        data.forEach(row => {
            const tr = document.createElement('tr');
            headers.forEach(h => {
                const td = document.createElement('td');
                td.textContent = row[h];
                tr.appendChild(td);
            });
            body.appendChild(tr);
        });
    });