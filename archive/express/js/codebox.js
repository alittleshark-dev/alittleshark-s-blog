function copyCode(btn) {
    const code = btn.nextElementSibling.querySelector('code').textContent;
    navigator.clipboard.writeText(code).then(() => {
        btn.textContent = '已复制!';
        setTimeout(() => btn.textContent = '复制', 1500);
    });
}

hljs.registerLanguage('x86asm', function(hljs) {
    var keywords = {
        keyword: 'mov movzx movsx movsd movsq movsw movsb movups movlpd movhps ' +
                 'movaps mova movnps movntps movnti movdq2q mfence sfence lfence ' +
                 'push pop pusha popa pushf popf ' +
                 'add sub mul div imul idiv inc dec and or xor not test cmp ' +
                 'jmp je je jne jg jl jge jle ja jb jae jb jc jnc ' +
                 'call ret retn nop ' +
                 'section .data .text .bss global extern ' +
                 'db dw dd dq dt ' +
                 'label equ times',
        built_in: 'eax ebx ecx edx esi edi ebp esp rax rbx rcx rdx rsi rdi rbp rsp ' +
                   'r8 r9 r10 r11 r12 r13 r14 r15 ' +
                   'al bl cl dl ah bh ch dh ' +
                   'ax bx cx dx ' +
                   'cs ds es fs gs ss ' +
                   'st0 st1 st2 st3 st4 st5 st6 st7 ' +
                   'xmm0 xmm1 xmm2 xmm3 xmm4 xmm5 xmm6 xmm7'
    };
    var COMMENT = hljs.COMMENT(';', '$');
    var NUMBER = {
        className: 'number',
        begin: hljs.NUMBER_RE + '\\b',
        relevance: 0
    };
    var STRING = {
        className: 'string',
        variants: [
            {begin: /'/, end: /'/},
            {begin: /"/, end: /"/},
            {begin: /`/, end: /`/}
        ]
    };
    return {
        keywords: keywords,
        contains: [
            COMMENT,
            STRING,
            NUMBER,
            {className: 'symbol', begin: /[a-zA-Z_]\w*:/, relevance: 0}
        ]
    };
});