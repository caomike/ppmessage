function hash_file(file, workers) {
    var i, buffer_size, block, threads, reader, blob, handle_hash_block, handle_load_block;

    handle_load_block = function (event) {
        for( i = 0; i < workers.length; i += 1) {
            threads += 1;
            workers[i].postMessage({
                'message' : event.target.result,
                'block' : block
            });
        }
    };
    handle_hash_block = function (event) {
        threads -= 1;

        if(threads === 0) {
            if(block.end !== file.size) {
                block.start += buffer_size;
                block.end += buffer_size;

                if(block.end > file.size) {
                    block.end = file.size;
                }
                reader = new FileReader();
                reader.onload = handle_load_block;
                blob = file.slice(block.start, block.end);

                reader.readAsArrayBuffer(blob);
            }
        }
    };
    buffer_size = 64 * 16 * 1024;
    block = {
        'file_size' : file.size,
        'start' : 0
    };

    block.end = buffer_size > file.size ? file.size : buffer_size;
    threads = 0;

    for (i = 0; i < workers.length; i += 1) {
        workers[i].addEventListener('message', handle_hash_block);
    }
    reader = new FileReader();
    reader.onload = handle_load_block;
    blob = file.slice(block.start, block.end);

    reader.readAsArrayBuffer(blob);
}
