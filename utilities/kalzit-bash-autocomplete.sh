_kalzit_autocomplete() 
{
    local cur prev opts
    COMPREPLY=()
    cur="${COMP_WORDS[COMP_CWORD]}"
    prev="${COMP_WORDS[COMP_CWORD-1]}"
    
    if [[ ${prev} != "kalzit" ]] ; then
    	#Second parameter
    	COMPREPLY=( $(compgen -W "$(kalzit get subUtilityNames ${prev})" -- ${cur}) )
    else
    	#First parameter
		COMPREPLY=( $(compgen -W "$(kalzit get baseUtilityNames)" -- ${cur}) )
		return 0
    fi
}
complete -F _kalzit_autocomplete kalzit