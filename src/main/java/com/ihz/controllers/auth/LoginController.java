package com.ihz.controllers.auth;

import com.ihz.forms.Register;
import com.ihz.models.User;
import com.ihz.services.SecurityService;
import com.ihz.services.UserDetailsServiceImpl;
import com.ihz.validation.EmailExistsException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationTrustResolver;
import org.springframework.security.authentication.AuthenticationTrustResolverImpl;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.ModelAndView;

import javax.validation.Valid;

@Controller
public class LoginController {

    @Autowired
    private UserDetailsServiceImpl service;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsService userDetailsService;


    @Autowired
    private SecurityService securityService;

    @RequestMapping(value = "/login", method = RequestMethod.GET)
    public String loginPage() {
        if (isAnonymous()) {
            return "login";
        } else {
            return "redirect:/accueil";
        }
    }

    @RequestMapping(value = "/register", method = RequestMethod.GET)
    public String showRegistrationForm(Model model) {
        Register user = new Register();
        model.addAttribute("user", user);
        return "register";
    }

    @RequestMapping(value = "/register", method = RequestMethod.POST)
    public ModelAndView registerUserAccount
            (@ModelAttribute("user") @Valid Register accountDto,
             BindingResult result, WebRequest request, Errors errors) {
        if (result.hasErrors()) {
            return new ModelAndView("register", "user", accountDto);
        }
        try {
            final User registered = service.registerNewUserAccount(accountDto);
            UserDetails userDetails = userDetailsService.loadUserByUsername(accountDto.getEmail());
            UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(userDetails, accountDto.getPassword(), userDetails.getAuthorities());
            authenticationManager.authenticate(usernamePasswordAuthenticationToken);
            System.out.println("isAuthenticated : "+usernamePasswordAuthenticationToken.isAuthenticated());
            //  ServletRequestAttributes attr = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
            // attr.getRequest().getSession().setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, SecurityContextHolder.getContext());
            if (usernamePasswordAuthenticationToken.isAuthenticated()) {
                SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
            }
            if (registered == null) {
                return new ModelAndView("register", "user", accountDto);
            }
        } catch (EmailExistsException $ex) {
            return new ModelAndView("register", "user", accountDto);
        }

        return new ModelAndView("index", "user", accountDto);
    }


    // temp we should use bean
    private boolean isAnonymous() {
        AuthenticationTrustResolver resolver = new AuthenticationTrustResolverImpl();
        SecurityContext ctx = SecurityContextHolder.getContext();
        if (ctx != null) {
            Authentication auth = ctx.getAuthentication();
            return resolver.isAnonymous(auth);
        }
        return true;
    }


}
