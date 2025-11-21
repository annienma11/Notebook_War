using UnityEngine;

namespace NotebookWar.Weapons
{
    public class Sniper : WeaponBase
    {
        [Header("Sniper Specific")]
        [SerializeField] private float scopeZoomFactor = 4f;
        [SerializeField] private float scopeTransitionSpeed = 6f;
        [SerializeField] private bool requiresScoping = true;
        
        private bool isScoped = false;
        private Camera playerCamera;
        private float originalFOV;

        protected override void Awake()
        {
            base.Awake();
            playerCamera = Camera.main;
            if (playerCamera != null)
                originalFOV = playerCamera.fieldOfView;
        }

        protected override void Update()
        {
            HandleScoping();
            base.Update();
        }

        private void HandleScoping()
        {
            if (playerCamera == null) return;

            bool scopeInput = input.GetAimInput();
            
            if (scopeInput && !isScoped)
            {
                isScoped = true;
            }
            else if (!scopeInput && isScoped)
            {
                isScoped = false;
            }

            // Smooth FOV transition for scope
            float targetFOV = isScoped ? originalFOV / scopeZoomFactor : originalFOV;
            playerCamera.fieldOfView = Mathf.Lerp(
                playerCamera.fieldOfView, 
                targetFOV, 
                scopeTransitionSpeed * Time.deltaTime
            );
        }

        protected override bool CanFire()
        {
            bool baseCanFire = base.CanFire();
            
            // If requires scoping, only allow firing when scoped
            if (requiresScoping)
                return baseCanFire && isScoped;
            
            return baseCanFire;
        }

        protected override void Fire()
        {
            // Sniper has perfect accuracy and high damage
            base.Fire();
            
            // Add scope sway after firing
            if (isScoped)
            {
                StartCoroutine(ScopeSway());
            }
        }

        private System.Collections.IEnumerator ScopeSway()
        {
            float swayDuration = 0.5f;
            float swayIntensity = 2f;
            float elapsed = 0f;

            while (elapsed < swayDuration)
            {
                float sway = Mathf.Sin(elapsed * 10f) * swayIntensity * (1f - elapsed / swayDuration);
                firePoint.localRotation = Quaternion.Euler(sway, sway * 0.5f, 0);
                
                elapsed += Time.deltaTime;
                yield return null;
            }

            firePoint.localRotation = Quaternion.identity;
        }

        protected override void OnHit(RaycastHit hit)
        {
            // Sniper does extra damage and can penetrate
            IDamageable damageable = hit.collider.GetComponent<IDamageable>();
            if (damageable != null)
            {
                // Sniper does 1.5x damage when scoped
                float finalDamage = isScoped ? weaponData.damage * 1.5f : weaponData.damage;
                damageable.TakeDamage(finalDamage);
            }
        }

        public bool IsScoped() => isScoped;
    }
}